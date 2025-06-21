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
        if (error.type === 'ValidationError') {
            return res.status(400).json({ message: 'Erro na validação.', errors: error.errors });
        }
        console.error('Erro interno ao criar categoria:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar criar a categoria.' });
 }

};

const getCategoryById = async (req, res) => {
    try {
 const { id } = req.params;
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'ID de categoria inválido.' });
        }
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        return res.status(200).json(category);
    } catch (error) {
        console.error('Erro no controller ao buscar categoria por ID:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
};


const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'ID de categoria inválido.' });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
        const wasUpdated = await categoryService.updateCategoryById(id, updateData);
        if (!wasUpdated) {
            return res.status(404).json({ message: 'Categoria não encontrada para atualização.' });
        }
        return res.status(204).send();
    } catch (error) {
        if (error.type === 'ValidationError') {
            return res.status(400).json({ message: 'Erro na validação ao atualizar categoria:', error });
 }
        console.error('Erro no controller ao atualizar categoria:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar atualizar a categoria.' });
    }
};


const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'ID de categoria inválido.' });
        }
        const wasDeleted = await categoryService.deleteCategoryById(id);
        if (!wasDeleted) {
            return res.status(404).json({ message: 'Categoria não encontrada para exclusão.' });
        }
 return res.status(204).send();
    } catch (error) {
        console.error('Erro no controller ao excluir categoria:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar excluir a categoria.' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const { limit, page, fields, use_in_menu } = req.query;
        const options = { where: {} };
        const pageLimit = parseInt(limit, 10) || 12;
        const currentPage = parseInt(page, 10) || 1;
        if (pageLimit !== -1) {
            options.limit = pageLimit;
            options.offset = (currentPage - 1) * pageLimit;
        }
        if (use_in_menu) {
            options.where.use_in_menu = (use_in_menu === 'true');
        }
        if (fields) {
            options.attributes = fields.split(',');
        }
        const result = await categoryService.getAllCategories(options);
        const response = {
            data: result.rows,
            total: result.count,
            limit: pageLimit,
            page: currentPage,
        };
        return res.status(200).json(response);
    } catch (error) {
        console.error('Erro no controller ao buscar todas as categorias:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
};


module.exports = {
    createCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    getAllCategories
};