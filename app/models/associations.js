const  User  = require('../models/customers');
const  UserHistory  = require('../models/userHistory');

const setupAssociations = () => {
  User.hasMany(UserHistory, { foreignKey: 'id_user' });
  UserHistory.belongsTo(User, { foreignKey: 'id_user' });
};

module.exports = { setupAssociations };