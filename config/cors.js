const cors = require('cors');
const dotenv=require("dotenv")
// Configuración de opciones de CORS
dotenv.config();
const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      // Puede Consultar la API
      callback(null, true);
  } else {
      // No esta Permitido
      callback(new Error('Error de Cors'));
  }
  }, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const configCors = cors(corsOptions);

module.exports = configCors;