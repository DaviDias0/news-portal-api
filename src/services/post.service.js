// src/services/post.service.js
const PostRepository = require('../repositories/post.repository');
const AppError = require('../errors/AppError');
const fs = require('fs').promises;
const path = require('path');

// --- MODIFICADO (para aceitar 'category') ---
function getPostWhereClause(status, category) {
  const whereClause = {};

  // 1. Filtro de Status (para o admin)
  if (status !== 'all') {
    whereClause.isPublished = true;
  }
  
  // 2. NOVO: Filtro de Categoria (para a Homepage G1)
  if (category) {
    whereClause.category = {
      equals: category,
      mode: 'insensitive' // Ignora maiúsculas/minúsculas
    };
  }

  return whereClause;
}
// --- FIM DA MODIFICAÇÃO ---

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

  // --- MODIFICADO (para aceitar 'category') ---
  async getAllPosts(page, limit, status, category) {
    const take = limit;
    const skip = (page - 1) * take;
    
    // O helper agora constrói o filtro
    const whereClause = getPostWhereClause(status, category);

    const totalItems = await PostRepository.countAll(whereClause);
    const posts = await PostRepository.findAll(whereClause, skip, take);

    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: posts,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async getPostById(postId) {
    const post = await PostRepository.findById(postId);
    if (!post) { throw new AppError('Notícia não encontrada.', 404); }
    return post;
  }

  // --- Rota de Categoria (da Fase 1) ---
  async getPostsByCategory(categoryName, page, limit) {
    const take = limit;
    const skip = (page - 1) * take;
    
    // Força 'isPublished: true' E filtra pela categoria
    const whereClause = getPostWhereClause(undefined, categoryName);

    const totalItems = await PostRepository.countAll(whereClause);
    const posts = await PostRepository.findAll(whereClause, skip, take);

    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      data: posts,
      totalItems,
      totalPages,
      currentPage: page,
    };
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

  // --- MODIFICADO (para usar o helper corretamente) ---
  async searchPosts(searchQuery, page, limit, status) {
    if (!searchQuery || searchQuery.trim() === '') {
      throw new AppError('O termo de busca (q) é obrigatório.', 400);
    }
    const formattedQuery = searchQuery.trim().split(' ').join(' & ');
    const take = limit;
    const skip = (page - 1) * take;
    
    // Passa 'status', mas não 'category' (a busca é global)
    const whereClause = getPostWhereClause(status, undefined); 

    const totalItems = await PostRepository.countSearch(formattedQuery, whereClause);
    const posts = await PostRepository.search(formattedQuery, skip, take, whereClause);

    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: posts,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}

module.exports = new PostService();