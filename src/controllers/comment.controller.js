// src/controllers/comment.controller.js
const CommentService = require('../services/comment.service');

class CommentController {
  async create(req, res, next) {
    try {
      const { content } = req.body;
      const { postId } = req.params;
      const authorId = req.user.id;
      const comment = await CommentService.createComment(content, authorId, postId);
      res.status(201).json(comment);
    } catch (error) { next(error); }
  }

  async getAllByPostId(req, res, next) {
    try {
      const { postId } = req.params;
      const comments = await CommentService.getCommentsByPostId(postId);
      res.status(200).json(comments);
    } catch (error) { next(error); }
  }
}
module.exports = new CommentController();