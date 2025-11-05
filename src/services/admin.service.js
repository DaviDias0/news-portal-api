// src/services/admin.service.js
const UserRepository = require('../repositories/user.repository'); // MUDANÇA
const AppError = require('../errors/AppError');
const { Role } = require('@prisma/client');

class AdminService {
  // --- MODIFICADO PARA PAGINAÇÃO ---
  async getAllUsers(page, limit) {
    const take = limit;
    const skip = (page - 1) * take;

    // Chama o repositório
    const { totalItems, users } = await UserRepository.findAndCountAll(skip, take);

    const totalPages = Math.ceil(totalItems / limit);

    // Retorna o objeto de paginação
    return {
      data: users,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
  // --- FIM DA MODIFICAÇÃO ---

  // --- REATORADO PARA REPOSITÓRIO ---
  async deleteUser(userIdToDelete) {
    const user = await UserRepository.findUnique(userIdToDelete);
    if (!user) { throw new AppError('Usuário não encontrado.', 404); }
    if (user.role === 'ADMIN') { throw new AppError('Não é possível deletar um administrador.', 403); }
    const postCount = await UserRepository.countPosts(userIdToDelete);
    if (postCount > 0) { throw new AppError('Não é possível deletar o usuário pois ele possui posts associados.', 403); }
    await UserRepository.delete(userIdToDelete);
    return;
  }

  // --- REATORADO PARA REPOSITÓRIO ---
  async updateUserRole(userIdToUpdate, newRole) {
    if (!Object.values(Role).includes(newRole)) { throw new AppError('Cargo inválido especificado.', 400); }
    const user = await UserRepository.findUnique(userIdToUpdate);
    if (!user) { throw new AppError('Usuário não encontrado.', 404); }
    return UserRepository.updateRole(userIdToUpdate, newRole);
  }
}
module.exports = new AdminService();