const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota pública para buscar categorias
router.get('/search', categoryController.getCategories);

// Rota pública para buscar uma categoria por ID
router.get('/:id', categoryController.getCategoriesById);

// Rota privada para criar uma categoria
router.post('/', authMiddleware, categoryController.createCategory);

// Rota privada para atualizar uma categoria
router.put('/:id', authMiddleware, categoryController.updateCategory);

// Rota privada para excluir uma categoria
router.delete('/:id', authMiddleware, categoryController.deleteCategory);


module.exports = router;
