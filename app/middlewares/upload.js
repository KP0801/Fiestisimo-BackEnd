const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'public/images', // Carpeta en la que se almacenarán las imágenes en Cloudinary
    format: async (req, file) => 'png', // Puedes personalizar el formato si es necesario
    public_id: (req, file) => `file-${req.body.name.replace(/\s+/g, '_')}`, // Nombre de la imagen en Cloudinary
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

module.exports = upload;


