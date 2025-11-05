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

  // --- MODIFICADO (para aceitar 'category') ---
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Lê 'status' E o novo 'category'
      const { status, category } = req.query; 
      
      // Passa 'category' para o service
      const result = await PostService.getAllPosts(page, limit, status, category);
      res.status(200).json(result);
    } catch (error) { next(error); }
  }

  async getOne(req, res, next) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) { next(error); }
  }

  async search(req, res, next) {
    try {
      const { q, status } = req.query; 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await PostService.searchPosts(q, page, limit, status);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // --- Rota de Categoria (da Fase 1) ---
  async getByCategory(req, res, next) {
    try {
      const { categoryName } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await PostService.getPostsByCategory(categoryName, page, limit);
      res.status(200).json(result);
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