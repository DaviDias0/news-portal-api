// src/routes/admin.routes.js
const { Router } = require('express');
const AdminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);
router.get('/users', AdminController.getAllUsers);
router.delete('/users/:id', AdminController.deleteUser);
router.put('/users/:id/role', AdminController.updateUserRole);
module.exports = router;