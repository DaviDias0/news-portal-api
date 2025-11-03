// src/routes/auth.routes.js
const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const profileUpload = require('../middlewares/profileUpload.middleware');

const router = Router();
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.use(authMiddleware);
router.get('/profile', AuthController.getProfile);
router.patch('/profile/picture', profileUpload.single('profileImage'), AuthController.updateProfilePicture);
module.exports = router;