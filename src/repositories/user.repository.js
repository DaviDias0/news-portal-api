// src/repositories/user.repository.js (VERSÃO COMPLETA E CORRIGIDA)
const prisma = require('../lib/prisma');

// Campos que SÃO seguros para mostrar
const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  profileImageUrl: true,
  createdAt: true,
};

class UserRepository {

  // --- FUNÇÕES DE AUTH (QUE FALTAVAM) ---
  async findByEmail(email) {
    // Retorna o usuário com a senha (necessário para o login)
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data) {
    return prisma.user.create({
      data: data,
      select: userSelectFields, // Retorna o usuário sem a senha
    });
  }
  
  async findById(userId) {
    // Retorna o usuário com a senha (para o updateProfilePicture)
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateProfilePicture(userId, newImageUrl) {
    return prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: newImageUrl },
      select: userSelectFields,
    });
  }
  // --- FIM DAS FUNÇÕES DE AUTH ---


  // --- Funções do Admin (que já tínhamos) ---
  async findAndCountAll(skip, take) {
    const [totalItems, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
        select: userSelectFields,
      }),
    ]);
    return { totalItems, users };
  }

  async countPosts(userId) {
    return prisma.post.count({
      where: { authorId: userId },
    });
  }

  async delete(userId) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateRole(userId, newRole) {
    return prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: userSelectFields,
    });
  }
}

module.exports = new UserRepository();