// src/controllers/productController.js
const ProductService = require('../services/productService');

module.exports = {
    async search(req, res) {
        try {
            // Desestruturando para capturar os parâmetros esperados pelo serviço
            const { limit, page, fields, match, category_ids, 'price-range': priceRange, ...options } = req.query;

            // Chamar o serviço com os parâmetros
            const result = await ProductService.search({ limit, page, fields, match, category_ids, priceRange, options });
            res.status(200).json(result);
        } catch (error) {
            console.error('Erro no controller ao buscar produtos:', error); // Log detalhado
            res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao buscar produtos.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getById(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error(`Erro no controller ao buscar produto por ID ${req.params.id}:`, error); // Log detalhado
            res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao buscar o produto.' });
        }
    },

    async create(req, res) {
        try {
            const product = await ProductService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            console.error('Erro no controller ao criar produto:', error); // Log detalhado
            // Retorna 400 para erros de validação ou dados inválidos
            res.status(400).json({ message: 'Erro ao criar produto.', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updated = await ProductService.update(id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            res.status(204).send(); // 204 No Content indica sucesso sem corpo de resposta
        } catch (error) {
            console.error(`Erro no controller ao atualizar produto ID ${req.params.id}:`, error); // Log detalhado
            res.status(400).json({ message: 'Erro ao atualizar produto.', details: error.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProductService.remove(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            res.status(204).send(); // 204 No Content
        } catch (error) {
            console.error(`Erro no controller ao deletar produto ID ${req.params.id}:`, error); // Log detalhado
            res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao deletar o produto.' });
        }
    }
};