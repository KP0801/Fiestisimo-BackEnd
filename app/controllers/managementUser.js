const User = require('../models/customers');
const UserHistory = require('../models/userHistory');
const { setupAssociations } = require('../models/associations');
const { Op } = require('sequelize');

// Llama a setupAssociations para configurar las asociaciones
setupAssociations();

//! Controlador que obtiene todos los usuarios registrados 
exports.getAllUsers = async (req, res) => {
  try {
    // Obtiene el id del usuario en sesión
    const userIdInSession = req.token.userId;

    // Obtiene todos los usuarios excluyendo al usuario en sesión
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      },
      where: {
        id_user: {
          [Op.ne]: userIdInSession 
        }
      }
    });

    // Filtra los usuarios para excluir aquellos con registros en UserHistory con active = false
    const filteredUsers = await Promise.all(users.map(async (user) => {
      const userHistoryRecord = await UserHistory.findOne({
        where: {
          id_user: user.id_user,
          active: false
        }
      });
      return userHistoryRecord ? null : user;
    }));

    // Filtra los usuarios nulos (aquellos que tienen un registro en UserHistory con active = false)
    const finalUsers = filteredUsers.filter(user => user !== null);

    if (finalUsers.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios activos.' });
    }

    res.status(200).json({ users: finalUsers });
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ error: 'Parece haber un problema al obtener todos los usuarios.' });
  }
};

  //! Controlador para obtener detalles de un usuario por ID
exports.getUsersById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Busca el usuario por su ID
      const user = await User.findByPk(id, {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'No se encontró el usuario con el ID especificado.' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error al obtener los ddetalles del usuario:', error);
      res.status(500).json({ error: 'Parece haber un problema al obtener detalles del usuario.' });
    }
  };

  //! Controlador para dar de baja a un usuario
  exports.createUserHistoryRecord = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(req.header);
  
      // Busca al usuario por su ID
      const user = await User.findByPk(userId);
  
      // Verifica si el usuario existe
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Busca el último registro en UserHistory para el usuario
    const lastUserHistory = await UserHistory.findOne({
        where: { id_user: userId },
        order: [['createdAt', 'DESC']],
      });
  
      // Verifica si existe un registro y si está activo
      if (lastUserHistory) {
        if (!lastUserHistory.active) {
          return res.status(401).json({ error: 'Este usuario ya ha sido desactivado anteriormente.' });
        }
        return res.status(200).json({ message: 'El usuario ya está activo', userHistoryRecord: lastUserHistory });
      }
  
      // Crea un nuevo registro 
      const userHistoryRecord = await UserHistory.create({
        id_user: userId,
        active: false,
      });
  
      res.status(201).json({ message: 'Usuario desactivado correctamente', userHistoryRecord });
    } catch (error) {
      console.error('Error al desactivar el usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  //! Controlador para cambiar el rol de un usuario
  exports.updateUserRole = async (req, res) => {
    const {userId} = req.params;

  try {
    // Busca al usuario por su ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if(user.role === 'admin'){
      return res.status(400).json({message:"Este usuario ya es administrador"})
    } else {
      await user.update({ role: 'admin' });
    }

    return res.json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
  };

  //! Controlador que obtiene usuarios desactivados
  exports.getInactiveUsers = async (req, res) => {
    try {
      // Busca los usuarios inactivos en UserHistory
      const inactiveUsers = await User.findAll({
        include: [
          {
            model: UserHistory,
            attributes: [],
            where: { active: false },
            required: true,
          },
        ],
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      });
  
      if (inactiveUsers.length === 0) {
        return res.status(404).json({ message: 'No se encontraron usuarios inactivos.' });
      }
  
      res.status(200).json({ inactiveUsers });
    } catch (error) {
      console.error('Error al obtener usuarios inactivos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };