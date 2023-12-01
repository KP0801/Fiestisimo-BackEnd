const express = require('express');
const router = express.Router();
const {registerUser} = require('../controllers/registerUser'); 

// Ruta para registrar un nuevo usuario 
router.post('/', registerUser);


module.exports = router;