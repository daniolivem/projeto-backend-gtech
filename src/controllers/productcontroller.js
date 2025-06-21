const ProductService = require('../services/productService');

module.exports = {
  async search(req, res) {
    try {
      const { limit, page, fields, match, category_ids, 'price-range': priceRange, ...options } = req.query;
      const result = await ProductService.search({ limit, page, fields, match, category_ids, priceRange, options });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
  },

  async getById(req, res) {
    try {
      const product = await ProductService.getById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
  },

  async create(req, res) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar produto.', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await ProductService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar produto.', details: error.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await ProductService.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
  }
};
