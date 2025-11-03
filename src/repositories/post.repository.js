// src/repositories/post.repository.js
const prisma = require('../lib/prisma');

class PostRepository {
  async create(data) {
    return prisma.post.create({
      data: data,
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async findAll() {
    return prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
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

  /**
   * (NOVO MÉTODO)
   * Busca notícias usando Full-Text Search do PostgreSQL
   * @param {string} query (O termo de busca)
   */
  async search(query) {
    return prisma.post.findMany({
      where: {
        // 'search' é a otimização do Prisma para full-text search.
        // Ele vai procurar o 'query' nos campos 'title' E 'content'.
        title: {
          search: query,
        },
        content: {
          search: query,
        },
        // Garante que só busca notícias publicadas
        isPublished: true, 
      },
      orderBy: {
        createdAt: 'desc', // Mais recentes primeiro
      },
      include: {
        author: { // Inclui o autor para os cards
          select: { id: true, name: true },
        },
      },
    });
  }
}

module.exports = new PostRepository();