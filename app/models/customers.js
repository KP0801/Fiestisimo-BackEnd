const { DataTypes, Sequelize } = require('sequelize');
const connection = require('../../config/database'); 

const User = connection.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
  },
  dni: {
    type: DataTypes.STRING(20),
  },
  role: {
    type: DataTypes.ENUM('cliente', 'admin'), 
    allowNull: false,
  },
});

User.sync({ force: false })
  .then(() => {
    console.log("Tabla usuarios sincronizada");
  })
  .catch((error) => {
    console.error("Error al sincronizar tabla de usuarios:", error);
});

module.exports = User;