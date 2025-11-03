// src/services/admin.service.js
const prisma = require('../lib/prisma');
const AppError = require('../errors/AppError');
const { Role } = require('@prisma/client');

class AdminService {
  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, profileImageUrl: true, createdAt: true }
    });
  }

  async deleteUser(userIdToDelete) {
    const user = await prisma.user.findUnique({ where: { id: userIdToDelete } });
    if (!user) { throw new AppError('Usuário não encontrado.', 404); }
    if (user.role === 'ADMIN') { throw new AppError('Não é possível deletar um administrador.', 403); }
    const postCount = await prisma.post.count({ where: { authorId: userIdToDelete } });
    if (postCount > 0) { throw new AppError('Não é possível deletar o usuário pois ele possui posts associados.', 403); }
    await prisma.user.delete({ where: { id: userIdToDelete } });
    return;
  }

  async updateUserRole(userIdToUpdate, newRole) {
    if (!Object.values(Role).includes(newRole)) { throw new AppError('Cargo inválido especificado.', 400); }
    const user = await prisma.user.findUnique({ where: { id: userIdToUpdate } });
    if (!user) { throw new AppError('Usuário não encontrado.', 404); }
    return prisma.user.update({
      where: { id: userIdToUpdate },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true, profileImageUrl: true, createdAt: true }
    });
  }
}
module.exports = new AdminService();