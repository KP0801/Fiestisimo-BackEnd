const FavoriteProducts = require('../models/favoriteProducts.js');
const Product = require('../models/products');
const {setupAssociations} = require('../models/associations.js');

// Llama a setupAssociations para configurar las asociaciones
setupAssociations();

//! Controlador para agregar los productos favoritos de un usuario
exports.createFavoriteProducts = async (req, res) => {
    try {
        const {userId} = req.params;
        const {productId} = req.params;

        // Verifica si el producto ya está registrado como favorito
        const existingFavorite = await FavoriteProducts.findOne({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (existingFavorite) {
            return res.status(400).json({ error: 'Este producto ya esta registrado en tus favoritos.' });
        }

        // Crea un nuevo registro del producto en tus favoritos
        await FavoriteProducts.create({
            userId: userId,
            productId: productId
        });

        res.status(200).json({ message: 'El producto se a agregado a tus favoritos.' });

    } catch (error) {
        console.error('Error al agregar producto como favorito:', error);
        res.status(500).json({ error: 'Parece haber un problema al agregar el producto como favorito.' });
    }
};

//! Controlador para eliminar los productos favoritos de un usuario
exports.deleteFavoriteProduct = async (req, res) => {
    try {
        const {userId} = req.params;
        const { productId } = req.params;

        // Verifica si el producto está registrado como favorito
        const existingFavorite = await FavoriteProducts.findOne({
            where: {
                userId: userId,
                productId: productId
            }
        });

        if (!existingFavorite) {
            return res.status(404).json({ error: 'Este producto no está registrado como favorito.' });
        }

        // Elimina el registro del producto de los favoritos
        await existingFavorite.destroy();

        res.status(200).json({ message: 'El producto se ha eliminado de tus favoritos.' });

    } catch (error) {
        console.error('Error al eliminar producto de favoritos:', error);
        res.status(500).json({ error: 'Parece haber un problema al eliminar el producto de favoritos.' });
    }
};

//! Controlador que obtiene todos los productos favoritos de un usuario
exports.getAllFavoriteProductsByUser = async (req, res) => {
    try {
        const userId = req.token.userId;

        // Obtén todos los registros de productos favoritos para el usuario dado
        const favoriteProducts = await FavoriteProducts.findAll({
            where: {
                userId: userId
            },
            include: [
                {
                    model: Product,
                    attributes: ['name', 'price', 'category','image'] 
                }
            ]
        });

        // Procesa la respuesta para obtener la información necesaria
        const processedFavoriteProducts = favoriteProducts.map((favorite) => ({
            id_product: favorite.productId,
            productName: favorite.Product.name,
            price: favorite.Product.price,
            category: favorite.Product.category,
            favorito: favorite.Product.favorito,
            image:favorite.Product.image
        }));

        res.status(200).json(processedFavoriteProducts);

    } catch (error) {
        console.error('Error al obtener productos favoritos:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener los productos favoritos.' });
    }
};