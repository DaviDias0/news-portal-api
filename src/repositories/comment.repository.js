// src/repositories/comment.repository.js
const prisma = require('../lib/prisma');

class CommentRepository {
  async create(content, authorId, postId) {
    return prisma.comment.create({
      data: { content, authorId, postId },
      include: {
        author: {
          select: { id: true, name: true, profileImageUrl: true },
        },
      },
    });
  }
  async findByPostId(postId) {
    return prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, name: true, profileImageUrl: true },
        },
      },
    });
  }
}
module.exports = new CommentRepository();