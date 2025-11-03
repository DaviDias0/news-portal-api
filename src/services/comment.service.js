// src/services/comment.service.js
const CommentRepository = require('../repositories/comment.repository');
const PostRepository = require('../repositories/post.repository');
const AppError = require('../errors/AppError');

class CommentService {
  async createComment(content, authorId, postId) {
    if (!content || !content.trim()) {
      throw new AppError('O conteúdo do comentário não pode estar vazio.', 400);
    }
    const post = await PostRepository.findById(postId);
    if (!post) {
      throw new AppError('Notícia não encontrada para comentar.', 404);
    }
    return CommentRepository.create(content, authorId, postId);
  }

  async getCommentsByPostId(postId) {
    return CommentRepository.findByPostId(postId);
  }
}
module.exports = new CommentService();