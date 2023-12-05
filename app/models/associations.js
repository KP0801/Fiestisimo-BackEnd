const  User  = require('../models/customers');
const  UserHistory  = require('../models/userHistory');
const FavoriteProduct = require('../models/favoriteProducts');
const Reservation = require('../models/reservation');
const ReservationDetail = require('../models/detailsReservation');

const setupAssociations = () => {
  // Relacion entre historial de usuario y usuario
  User.hasMany(UserHistory, { foreignKey: 'id_user' });
  UserHistory.belongsTo(User, { foreignKey: 'id_user' });

  // Relacion entre User y FavoriteProduct
  User.hasMany(FavoriteProduct, { foreignKey: 'userId' });
  FavoriteProduct.belongsTo(User, { foreignKey: 'userId' });

  // Relacion entre FavoriteProduct y Product
  const Product = require('../models/products');
  FavoriteProduct.belongsTo(Product, { foreignKey: 'productId' });
  Product.hasMany(FavoriteProduct, { foreignKey: 'productId' });

  // Relacion entre reservaciones y detalles de reservacion
  Reservation.hasMany(ReservationDetail, { foreignKey: 'reservationId' });

  // Relacion entre detalles de reservacion y reservacion
  ReservationDetail.belongsTo(Reservation, { foreignKey: 'reservationId' });

  // Relacion entre productos y reservaciones
  ReservationDetail.belongsTo(Product, { foreignKey: 'productId' });

  // Relación entre User y Reservation
  User.hasMany(Reservation, { foreignKey: 'userId' });
  Reservation.belongsTo(User, { foreignKey: 'userId' });
};

module.exports = { setupAssociations };