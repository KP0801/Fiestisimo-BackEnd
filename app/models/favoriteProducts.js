const { DataTypes } = require('sequelize');
const connection = require('../../config/database');

const FavoriteProduct = connection.define('FavoriteProduct', {
  id_favorite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

FavoriteProduct.sync({ force: false })
  .then(() => {
    console.log("Tabla de productos favoritos sincronizada");
  })
  .catch((error) => {
    console.error("Error al sincronizar tabla de productos favoritos:", error);
});

module.exports = FavoriteProduct;