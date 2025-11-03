// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const AppError = require('../errors/AppError');

const uploadDir = 'uploads/covers';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(8, (err, buf) => {
      if (err) return cb(err);
      const fileExtension = path.extname(file.originalname);
      const fileName = buf.toString('hex') + '-' + Date.now() + fileExtension;
      cb(null, fileName);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Apenas ficheiros de imagem são permitidos!', 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});
module.exports = upload;