// src/services/auth.service.js
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const AppError = require('../errors/AppError');
const UserRepository = require('../repositories/user.repository');

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;
    if (!name || !email || !password) { throw new AppError('Nome, e-mail e senha são obrigatórios.', 400); }
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) { throw new AppError('Este e-mail já está em uso.', 409); }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await UserRepository.create({ name, email, password: hashedPassword });
    delete user.password;
    return user;
  }

  async login(credentials) {
    const { email, password } = credentials;
    if (!email || !password) { throw new AppError('E-mail e senha são obrigatórios.', 400); }
    const user = await UserRepository.findByEmail(email);
    if (!user) { throw new AppError('Credenciais inválidas.', 401); }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) { throw new AppError('Credenciais inválidas.', 401); }
    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) { throw new AppError('Erro interno do servidor.', 500); }
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1d' });
    return { token };
  }

  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) { throw new AppError('Usuário não encontrado.', 404); }
    delete user.password;
    return user;
  }

  async updateProfilePicture(userId, filename) {
    const currentUser = await UserRepository.findById(userId);
    if (!currentUser) { throw new AppError('Usuário não encontrado.', 404); }
    
    const newImageUrl = `/uploads/profiles/${filename}`;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: newImageUrl },
      select: { id: true, name: true, email: true, role: true, profileImageUrl: true, createdAt: true }
    });

    if (currentUser.profileImageUrl) {
      try {
        const oldImageFilename = path.basename(currentUser.profileImageUrl);
        const oldImagePath = path.resolve(__dirname, '..', '..', 'uploads', 'profiles', oldImageFilename);
        await fs.unlink(oldImagePath);
      } catch (unlinkError) {
        if (unlinkError.code !== 'ENOENT') {
          console.warn(`Aviso: Falha ao deletar imagem de perfil antiga:`, unlinkError.message);
        }
      }
    }
    return updatedUser;
  }
}
module.exports = new AuthService();