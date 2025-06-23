// src/controllers/productController.js
const ProductService = require('../services/productService');

module.exports = {
    async search(req, res) {
        try {
            const { limit, page, fields, match, category_ids, 'price-range': priceRange, ...options } = req.query;
            const result = await ProductService.search({ limit, page, fields, match, category_ids, priceRange, options });
            res.status(200).json(result);
        } catch (error) {
            console.error('Erro no controller ao buscar produtos:', error);
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
            console.error(`Erro no controller ao buscar produto por ID ${req.params.id}:`, error);
            res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao buscar o produto.' });
        }
    },

    async create(req, res) {
        try {
            const product = await ProductService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            console.error('Erro no controller ao criar produto:', error);
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
            res.status(204).send();
        } catch (error) {
            console.error(`Erro no controller ao atualizar produto ID ${req.params.id}:`, error);
            res.status(400).json({ message: 'Erro ao atualizar produto.', details: error.message });
        }
    },

    async remove(req, res) {
        try {
            // CORREÇÃO AQUI: Garante que o ID é um número inteiro, base 10
            const id = parseInt(req.params.id, 10); 

            // Adicione um console.log para verificar o ID que está sendo recebido
            console.log(`Tentando remover produto com ID: ${id} (Tipo: ${typeof id})`);

            const deleted = await ProductService.remove(id);
            if (!deleted) {
                console.log(`Produto com ID ${id} não encontrado para remoção.`);
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            console.log(`Produto com ID ${id} removido com sucesso.`);
            res.status(204).send();
        } catch (error) {
            console.error(`Erro no controller ao deletar produto ID ${req.params.id}:`, error);
            res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao deletar o produto.' });
        }
    }
};