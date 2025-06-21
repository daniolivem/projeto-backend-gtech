// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // <-- IMPORTADO O MIDDLEWARE DE AUTENTICAÇÃO

// Rotas para produtos (sem o prefixo '/v1/product' pois já é adicionado em app.js)
router.get('/search', productController.search);           // Requisito 01
router.get('/:id', productController.getById);             // Requisito 02
router.post('/', authMiddleware, productController.create); // Requisito 03 - Protegido
router.put('/:id', authMiddleware, productController.update);   // Requisito 04 - Protegido
router.delete('/:id', authMiddleware, productController.remove); // Requisito 05 - Protegido

module.exports = router;