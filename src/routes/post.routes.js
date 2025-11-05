// src/routes/post.routes.js
const { Router } = require('express');
const PostController = require('../controllers/post.controller');
const CommentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

// --- ROTAS PÚBLICAS ---

// Listar todos os posts
// GET /posts
router.get('/', PostController.getAll);

// (NOVA) Rota de Busca
// GET /posts/search?q=termo
router.get('/search', PostController.search);

// --- 🚀 NOVA ROTA DE CATEGORIA ---
// Deve vir ANTES de '/:id'
// GET /posts/category/tecnologia
router.get('/category/:categoryName', PostController.getByCategory);
// --- FIM DA NOVA ROTA ---


// --- ROTAS DE COMENTÁRIOS (Têm de vir antes de /:id) ---
router.get('/:postId/comments', CommentController.getAllByPostId);
router.post('/:postId/comments', authMiddleware, CommentController.create);

// --- ROTAS GENÉRICAS DE POST (Têm de vir depois de /search e /category) ---
// GET /posts/:id (Buscar um post específico)
router.get('/:id', PostController.getOne);


// --- ROTAS DE ADMIN (Tudo abaixo requer Admin) ---
router.use(authMiddleware);
router.use(adminMiddleware);

// POST /posts (Criar)
router.post(
  '/',
  upload.single('coverImage'),
  PostController.create
);

// PUT /posts/:id (Atualizar)
router.put(
  '/:id',
  upload.single('coverImage'),
  PostController.update
);

// DELETE /posts/:id (Deletar)
router.delete('/:id', PostController.delete);

module.exports = router;