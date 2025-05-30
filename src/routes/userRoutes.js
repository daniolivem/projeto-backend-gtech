const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota pública: gerar token JWT
router.post('/token', userController.loginUser); 

// Rota pública: cadastrar usuário e buscar usuário por ID
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas protegidas:

router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUser);

module.exports = router;