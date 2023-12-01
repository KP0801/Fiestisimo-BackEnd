const { DataTypes } = require('sequelize');
const connection = require('../../config/database');

const UserHistory = connection.define('UserHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
  },
});

UserHistory.sync({ force: false })
  .then(() => {
    console.log("Tabla UserHistory sincronizada");
  })
  .catch((error) => {
    console.error("Error al sincronizar tabla UserHistory:", error);
});

module.exports = UserHistory;