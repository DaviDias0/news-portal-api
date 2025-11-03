// src/services/post.service.js
const PostRepository = require('../repositories/post.repository');
const AppError = require('../errors/AppError');
const fs = require('fs').promises;
const path = require('path');

class PostService {
  async createPost(postData, authorId) {
    const { title, content, category, coverImageUrl } = postData;
    if (!title || !content || !category || !coverImageUrl) {
      throw new AppError('Todos os campos (título, conteúdo, categoria, imagem) são obrigatórios.', 400);
    }
    const dataToSave = { ...postData, authorId: authorId };
    const post = await PostRepository.create(dataToSave);
    if (!post) { throw new AppError('Falha ao criar post no repositório.', 500); }
    return post;
  }

  async getAllPosts() {
    return PostRepository.findAll();
  }

  async getPostById(postId) {
    const post = await PostRepository.findById(postId);
    if (!post) { throw new AppError('Notícia não encontrada.', 404); }
    return post;
  }

  async updatePost(postId, userId, updateData, newImagePath) {
    const post = await PostRepository.findById(postId);
    if (!post) { throw new AppError('Notícia não encontrada.', 404); }
    const dataToUpdate = { ...updateData };
    if (newImagePath) {
      if (post.coverImageUrl) {
        const oldImageName = path.basename(post.coverImageUrl);
        const oldImagePath = path.resolve(__dirname, '..', '..', 'uploads', 'covers', oldImageName);
        try { await fs.unlink(oldImagePath); } catch (err) {
          if(err.code !== 'ENOENT') console.warn(`Aviso: Imagem antiga ${oldImagePath} não encontrada.`);
        }
      }
      dataToUpdate.coverImageUrl = newImagePath;
    }
    return PostRepository.update(postId, dataToUpdate);
  }

  async deletePost(postId, userId) {
    const post = await PostRepository.findById(postId);
    if (!post) { throw new AppError('Notícia não encontrada.', 404); }
    if (post.coverImageUrl) {
      const imageName = path.basename(post.coverImageUrl);
      const imagePath = path.resolve(__dirname, '..', '..', 'uploads', 'covers', imageName);
      try { await fs.unlink(imagePath); } catch (err) {
        if(err.code !== 'ENOENT') console.warn(`Aviso: Imagem ${imagePath} não encontrada.`);
      }
    }
    await PostRepository.delete(postId);
  }

  /**
   * (NOVO MÉTODO)
   * Lida com a lógica de busca
   * @param {string} searchQuery
   */
  async searchPosts(searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') {
      throw new AppError('O termo de busca (q) é obrigatório.', 400);
    }
    // Formata a query para o 'search' (substituir espaços por '&')
    const formattedQuery = searchQuery.trim().split(' ').join(' & ');
    console.log(`[SERVICE] Buscando por: ${formattedQuery}`);
    return PostRepository.search(formattedQuery);
  }
}

module.exports = new PostService();