// src/repositories/post.repository.js
const prisma = require('../lib/prisma');

class PostRepository {
  async create(data) {
    return prisma.post.create({
      data: data,
      include: { author: { select: { id: true, name: true } } },
    });
  }

  // --- MODIFICADO (Ordem dos argumentos) ---
  async findAll(whereClause, skip, take) {
    return prisma.post.findMany({
      skip: skip,
      take: take,
      where: whereClause, 
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // --- MODIFICADO (Ordem dos argumentos) ---
  async countAll(whereClause) {
    return prisma.post.count({
      where: whereClause,
    });
  }

  async findById(postId) {
    return prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async update(postId, data) {
    return prisma.post.update({
      where: { id: postId },
      data: data,
    });
  }

  async delete(postId) {
    return prisma.post.delete({
      where: { id: postId },
    });
  }

  // --- (search - Sem mudança na assinatura, mas o typo 'a' foi removido) ---
  async search(query, skip, take, whereClause) {
    return prisma.post.findMany({
      skip: skip,
      take: take,
      where: {
        ...whereClause, 
        title: {
          search: query,
        },
        content: {
          search: query,
        },
      }, // O 'a' que estava aqui foi removido
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async countSearch(query, whereClause) {
    return prisma.post.count({
      where: {
        ...whereClause,
        title: {
          search: query,
        },
        content: {
          search: query,
        },
      },
    });
  }
}

module.exports = new PostRepository();