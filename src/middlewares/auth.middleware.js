// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const UserRepository = require('../repositories/user.repository'); // Vamos criar este a seguir

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token não fornecido ou mal formatado.', 401));
  }
  const token = authHeader.split(' ')[1];
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);
    const user = await UserRepository.findById(decoded.id); 
    if (!user) {
      return next(new AppError('Usuário do token não existe mais.', 401));
    }
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
};
module.exports = authMiddleware;