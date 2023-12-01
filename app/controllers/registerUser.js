const bcrypt = require('bcryptjs');
const User = require('../models/customers'); 
const sendMail = require('../../utils/sendMail');

//! Controlador para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    // Cuerpo de la solicitud
    const { name, email, phone, password } = req.body;
    console.log(req.body);

    // Verifica si el usuario existe mediante su correo
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Verifica si el usuario existe mediante su telefono
    const existingUser1 = await User.findOne({ where: { phone } });
    if (existingUser1) {
      return res.status(400).json({ error: 'El teléfono ya está registrado.' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'cliente', 
    });

     // Correo electronico de confirmacion
     const emailOptions = {
      subject: 'Registro exitoso en tu aplicación', // Asunto
    };

    // Fecha y hora actual
    const currentDate = new Date().toLocaleString();

    const emailParams = {
      email: newUser.email,
      name: newUser.name, 
      password: password, 
      currentDate: currentDate,
    };

    await sendMail(email, emailOptions, 'registration', emailParams);

    // Envia una respuesta exitosa
    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
};
