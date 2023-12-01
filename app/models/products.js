const { DataTypes } = require('sequelize');
const connection = require('../../config/database');

const Product = connection.define('Product', {
  id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
        type:DataTypes.STRING,
        allowNull:false
    },
  category: {
    type: DataTypes.ENUM('Postres', 'Desayunos', 'Pasteles', 'Arreglos'),
    allowNull: false,
  },
},);

Product.sync({ force: false })
  .then(() => {
    console.log("Tabla de productos sincronizada");
  })
  .catch((error) => {
    console.error("Error al sincronizar tabla de productos:", error);
});

module.exports = Product;