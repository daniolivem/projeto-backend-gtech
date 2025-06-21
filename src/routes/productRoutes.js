const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/v1/product/search', productController.search);       // Requisito 01
router.get('/v1/product/:id', productController.getById);         // Requisito 02
router.post('/v1/product', productController.create);             // Requisito 03
router.put('/v1/product/:id', productController.update);          // Requisito 04
router.delete('/v1/product/:id', productController.remove);       // Requisito 05

module.exports = router;
