const categoryService = require('../services/categoryService.js');

const createCategory = async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Os campos "name" e "slug" são obrigatórios.' });
        }
        const newCategory = await categoryService.createCategory({ name, slug, use_in_menu });
            return res.status(201).json(newCategory);
        } catch (error) {
            // Trata erros de validação específicos lançados pelo serviço
            if (error.type === 'ValidationError') {
                return res.status(400).json({ message: 'Erro na validação.', error});
            }
            // Loga outros erros internos e retorna uma resposta genérica de erro 500
            console.error('Erro interno ao criar categoria:', error);
            return res.status(500).json({ message: 'Erro interno ao tentar criar a categoria.' });
        }

};

module.exports = {
    createCategory,
};