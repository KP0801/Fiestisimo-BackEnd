const { DataTypes } = require('sequelize');
const connection = require('../../config/database');

const Reservation = connection.define('Reservation', {
  reservationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
    time: true,
  },
  status: {
    type: DataTypes.ENUM('pendiente','en preparacion', 'finalizado', 'cancelada'),
    defaultValue: 'pendiente',
  },
});

Reservation.sync({ force: false })
  .then(() => {
    console.log("Tabla de reservaciones sincronizada");
  })
  .catch((error) => {
    console.error("Error al sincronizar tabla de reservaciones:", error);
  });

module.exports = Reservation;