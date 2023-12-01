const jwt = require('jsonwebtoken');
require("dotenv").config();

//! Valida el token de acceso
exports.authToken = async (req, res,next) => {
    try {
        const  token  = req.headers.authorization?.split(' ').pop()|| req.params.token; 
        if(token){
            
            jwt.verify(token, process.env.HASHPASS, async function (err, decoded) {
                if(err){
                    next(err);
                }else{
                    req.token = decoded;
                    next();              
                }
            });
        }else{
            return res.status(404).json({ message: 'No se proporcionó un token de autenticación' });
        }

    } catch (err) {
        next(err);
    }

}

//! Valida el token de acceso solo para admin
exports.tokenVerifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ').pop() || req.params.token;

        if (token) {
            jwt.verify(token, process.env.HASHPASS, async function (err, decoded) {
                if (err) {
                    next(err);
                } else {
                    // Verifica el rol del usuario
                    if (decoded.role === 'admin') {
                        req.token = decoded;
                        next();
                    } else {
                        console.log('Rol del usuario:', decoded.role);
                        return res.status(403).json({ message: 'Acceso no autorizado. Se requiere rol de Administrador.' });
                    }
                }
            });
        } else {
            return res.status(404).json({ message: 'No se proporcionó un token de autenticación' });
        }

    } catch (err) {
        next(err);
    }
}
