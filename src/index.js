// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importa as nossas rotas
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes'); 
const adminRoutes = require('./routes/admin.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir a pasta 'uploads' publicamente
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rota de Teste
app.get('/', (req, res) => {
  res.json({ message: 'API do News Portal está online!' });
});

// --- ROTAS ---
app.use('/auth', authRoutes);
app.use('/posts', postRoutes); 
app.use('/admin', adminRoutes);

// --- MIDDLEWARE DE ERRO (TEM DE SER O ÚLTIMO) ---
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});