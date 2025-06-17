const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
// verificar a autenticação apenas para rotas que modificam dados (POST, PUT, DELETE) 

router.post('/', authMiddleware, categoryController.createCategory);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', authMiddleware, categoryController.updateCategoryById);


module.exports = router;

