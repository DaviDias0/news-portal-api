// src/controllers/post.controller.js
const PostService = require('../services/post.service');
const AppError = require('../errors/AppError');

class PostController {
  async create(req, res, next) {
    try {
      if (!req.file) { throw new AppError('A imagem de capa é obrigatória.', 400); }
      const authorId = req.user.id;
      const postData = req.body;
      postData.coverImageUrl = `/uploads/covers/${req.file.filename}`;
      postData.isPublished = postData.isPublished === 'true';
      postData.isFeatured = postData.isFeatured === 'true';
      const post = await PostService.createPost(postData, authorId);
      res.status(201).json(post);
    } catch (error) { next(error); }
  }

  async getAll(req, res, next) {
    try {
      const posts = await PostService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) { next(error); }
  }

  async getOne(req, res, next) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) { next(error); }
  }

  /**
   * (NOVO MÉTODO)
   * Lida com GET /posts/search
   */
  async search(req, res, next) {
    try {
      const { q } = req.query; // Pega o termo de busca (ex: ?q=react)
      const posts = await PostService.searchPosts(q);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const updateData = req.body;
      let newImagePath;
      if (req.file) {
        newImagePath = `/uploads/covers/${req.file.filename}`;
      }
      if (updateData.isPublished) updateData.isPublished = updateData.isPublished === 'true';
      if (updateData.isFeatured) updateData.isFeatured = updateData.isFeatured === 'true';
      const updatedPost = await PostService.updatePost(postId, userId, updateData, newImagePath);
      res.status(200).json(updatedPost);
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await PostService.deletePost(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}

module.exports = new PostController();