const User = require("../models/customers");
const bcrypt = require("bcryptjs");
const sendMail = require("../../utils/sendMail");

//! Controlador para actualizar la contraseña de un usuario
exports.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Busca al usuario
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Correo electrónico incorrecto" });
    }

    // Hashea la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualiza la contraseña del usuario
    user.password = hashedPassword;
    await user.save();

    // Responde con un mensaje de éxito
    res.status(200).json({ message: "Contraseña actualizada con éxito" });

    // Correo electronico de confirmacion
    const emailOptions = {
      subject: "Contraseña actualizada con éxito", // Asunto
    };

    // Fecha y hora actual
    const currentDate = new Date().toLocaleString();

    const emailParams = {
      email: user.email,
      name: user.name,
      password: req.body.newPassword,
      currentDate: currentDate,
    };

    await sendMail(req.body.email, emailOptions, "resetPassword", emailParams);
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
};
