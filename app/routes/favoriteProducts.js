const express = require('express');
const router = express.Router();
const {authToken} = require('../middlewares/authToken');
const {createFavoriteProducts, deleteFavoriteProduct, getAllFavoriteProductsByUser} = require('../controllers/favoriteProducts'); 

// Rutas para productos favoritos
router.post('/:userId/:productId',createFavoriteProducts);
router.delete('/:userId/:productId', deleteFavoriteProduct);
router.get('/', authToken, getAllFavoriteProductsByUser)

module.exports = router;
