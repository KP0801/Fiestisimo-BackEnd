const bcrypt = require('bcryptjs');
const User = require('../models/customers');
const UserHistory = require('../models/userHistory')
const jwtUtils = require('../../utils/authToken');
const jwt = require('jsonwebtoken');

//! Controlador para autenticacion de usuarios
exports.authenticateUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Busca al usuario por su correo electrónico
      const user = await User.findOne({ where: { email } });
  
      // Mensaje de error
      if (!user) {
        return res.status(500).json({ error: 'Correo o contraseña incorrecta. Intente de nuevo' });
      }
  
      // Compara la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(500).json({ error: 'Contraseña incorrecta. Intente de nuevo' });
      }
  
      // Verifica si el usuario está desactivado
      const userHistory = await UserHistory.findOne({
        where: { id_user: user.id_user },
        order: [['createdAt', 'DESC']],
      });

      // Verifica si existe un registro
      const isDeactivated = userHistory ? !userHistory.active : false;

      // Verifica si el usuario está desactivado
      if (isDeactivated) {
        return res.status(401).json({ error: 'Usuario inactivo. Contacte al administrador.' });
      }

      // Generacion del token con información del usuario
      const payload = {
        userId: user.id_user,
        email: user.email,
        role: user.role, 
      };
      const expiresIn = '1h'; // 1 hora de expiración
      const token = jwtUtils.generateAuthToken(payload, expiresIn);

      // Envia el token como respuesta
      res.status(200).json({ message: 'Autenticación exitosa', token });
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(500).json({ error: 'Error de autenticación' });
    }
  };

  //! Controlador para enviar información de perfil de usuario
  exports.getUserProfile = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
      // Verifica y decodifica el token 
      const tokenWithoutBearer = token.replace('Bearer ', ''); //Elimina Bearer de el inicio de la solicitud
      const decodedToken = jwt.verify(tokenWithoutBearer, process.env.HASHPASS);
  
      // Extrae el ID del usuario
      const userId = decodedToken.userId;
    
      console.log(userId);

      // Busca al usuario por ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Devuelve la información del perfil del usuario
      res.status(200).json({
        id:user.id_user,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dni: user.dni,
        role: user.role,
      });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };

  