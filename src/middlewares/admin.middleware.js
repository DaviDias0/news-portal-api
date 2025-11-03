// src/middlewares/admin.middleware.js
const AppError = require('../errors/AppError');

const adminMiddleware = (req, res, next) => {
  // Este middleware RODA DEPOIS do authMiddleware
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    next(new AppError('Acesso negado. Apenas administradores.', 403));
  }
};
module.exports = adminMiddleware;