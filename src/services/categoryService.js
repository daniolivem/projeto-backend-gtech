// src/services/categoryService.js
const { Category } = require('../models');

/**
 * Cria uma nova categoria no banco de dados.
 * @param {object} categoryData - Dados da categoria (name, slug, use_in_menu).
 * @returns {Promise<Category>} O objeto da categoria criada.
 */
const createCategory = async (categoryData) => {
    try {
        const newCategory = await Category.create(categoryData);
        return newCategory;
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => ({ message: err.message, field: err.path }));
            throw { type: 'ValidationError', errors };
        }
        console.error('Erro no serviço de criação de categoria:', error);
        throw error;
    }
};

/**
 * Busca uma categoria pelo seu ID.
 * @param {number} id - O ID da categoria.
 * @returns {Promise<Category|null>} O objeto da categoria ou null se não for encontrada.
 */
const findCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id);
 return category;
    } catch (error) {
        console.error('Erro no serviço de busca de categoria por ID:', error);
        throw error;
    }
};

/**
 * Atualiza uma categoria existente pelo ID.
 * @param {number} id - O ID da categoria.
 * @param {object} updateData - Dados a serem atualizados.
 * @returns {Promise<boolean>} Retorna true se atualizou, false se não encontrou.
 */
const updateCategoryById = async (id, updateData) => {
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return false;
        }
        await category.update(updateData);
        return true; // AJUSTE: Retorna true para indicar sucesso.
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => ({ message: err.message, field: err.path })); // 'erros' corrigido para 'errors'
            throw { type: 'ValidationError', errors }; // 'erros' corrigido para 'errors'
        }
        console.error('Erro no serviço de atualização de categoria:', error);
        throw error;
    }
};

/**
 * Deleta uma categoria pelo ID.
 * @param {number} id - O ID da categoria a ser deletada.
 * @returns {Promise<boolean>} Retorna true se o usuário foi deletado, false se não foi encontrado.
 */
const deleteCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return false;
        }
        await category.destroy();
        return true; // AJUSTE: Retorna true para indicar sucesso.
    } catch (error) {
        console.error('Erro no serviço de exclusão de categoria:', error);
        throw error;
    }
};

/**
 * Busca todas as categorias com opções de filtro, paginação e seleção de campos.
 * @param {object} options - Opções de consulta para a busca.
 * @returns {Promise<{count: number, rows: Category[]}>} Objeto com a contagem total e as linhas encontradas.
 */
const findAllCategories = async (options) => {
    try {
        const categories = await Category.findAndCountAll(options);
        return categories;
    } catch (error) {
        console.error('Erro no serviço de busca de todas as categorias:', error);
        throw error;
    }
};

module.exports = {
    createCategory,
    findCategoryById, // Renomeado para consistência
    updateCategoryById,
    deleteCategoryById,
    findAllCategories, // Renomeado para consistência
};