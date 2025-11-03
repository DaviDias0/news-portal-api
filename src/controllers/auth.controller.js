// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const AppError = require('../errors/AppError');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error) { next(error); }
  }

  async login(req, res, next) {
    try {
      const { token } = await AuthService.login(req.body);
      res.status(200).json({ token });
    } catch (error) { next(error); }
  }

  async getProfile(req, res, next) {
    try {
      const userProfile = await AuthService.getProfile(req.user.id); 
      res.status(200).json(userProfile);
    } catch (error) { next(error); }
  }

  async updateProfilePicture(req, res, next) {
    try {
      if (!req.file) { throw new AppError('Nenhum arquivo de imagem foi enviado.', 400); }
      const userId = req.user.id;
      const filename = req.file.filename;
      const updatedUser = await AuthService.updateProfilePicture(userId, filename);
      res.status(200).json(updatedUser);
    } catch (error) {
      if (req.file && req.file.path) {
        require('fs').promises.unlink(req.file.path).catch(err => console.error("Erro ao deletar arquivo órfão:", err));
      }
      next(error);
    }
  }
}
module.exports = new AuthController();