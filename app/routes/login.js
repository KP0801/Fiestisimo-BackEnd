const express = require('express');
const router = express.Router();
const {authenticateUser, get, getUserProfile} = require('../controllers/authUser');
const {updatePassword} = require('../controllers/resetPassword')

// Autenticación de usuarios
router.post('/', authenticateUser);
router.get('/', getUserProfile);
router.put('/', updatePassword);

module.exports = router;