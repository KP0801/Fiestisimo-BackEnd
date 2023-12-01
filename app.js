const express = require('express') ;
const app = express();
const http = require('http').createServer(app);
const configCors = require('./config/cors');
const path = require('path');
const bodyParser = require('body-parser');
const sendMail = require('./utils/sendMail');
const sequelize = require('./config/database'); 

app.use(configCors);
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');

//Conexión a la base de ddatos
(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();

//Configuracion para servir archivos estaticos
const imagesPath = path.join(__dirname, 'public', 'images');
const docsPath = path.join(__dirname, 'public', 'docs');


app.use(express.static('./public'));
app.use('/docs', express.static(docsPath));
app.use('/images', express.static(imagesPath));


// Rutas 
app.use('/fiestisimo', require('./app/routes'));

const PORT = process.env.PORT;


//Levantando servidor
http.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`)

});