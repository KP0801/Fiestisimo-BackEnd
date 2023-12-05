const { DataTypes } = require('sequelize');
const connection = require('../../config/database');

const ReservationDetail = connection.define('ReservationDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reservationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

ReservationDetail.sync({ force: false })
  .then(() => {
    console.log("Tabla de detalles de reservación sincronizada");
  })
  .catch((error) => {
    console.error("Error al sincronizar tabla de detalles de reservación:", error);
  });

module.exports = ReservationDetail;