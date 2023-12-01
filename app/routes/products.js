const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {authToken, tokenVerifyAdmin} = require('../middlewares/authToken');
const {createProduct, getProductsByCategory, 
    editProduct, deleteProduct, 
    getProductById, getLowestPriceProducts, getAllProducts} = require('../controllers/products'); 

// Rutas para productos
router.post('/', tokenVerifyAdmin, upload.single('image'), createProduct); //Agrega productos
router.get('/category/:category', authToken, getProductsByCategory); //Obtiene productos por categoria
router.get('/:id', authToken, getProductById); //Obtiene productos especificos
router.put('/edit/:id', tokenVerifyAdmin, editProduct); //Edita productos
router.delete('/:id', tokenVerifyAdmin, deleteProduct); //Elimina productos
router.get('/cheap/products', authToken, getLowestPriceProducts); //Obtiene los productos con el precio mas bajo
router.get('/all/products', getAllProducts)
module.exports = router;
