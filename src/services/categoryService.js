const { Category } = require('../models');

/**
 * Cria uma nova categoria.
 * @param {object} categoryData - Dados da categoria a ser criada.
 * @returns {Promise<Category>} - Categoria criada.
 */
const createCategory = async (categoryData) => {
    try {
        // Cria a nova categoria no banco de dados
        const newCategory = await Category.create(categoryData);
        return newCategory;
    } catch (error) {
        // Trata erros de validação ou restrição única do Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => ({
                message: err.message, field: err.path}));
            throw { type: 'ValidationError', errors};
        }
        // Loga outros erros e os re-lança
        console.error('Erro no serviço de criação de categoria: ', error);
        throw error;
    }
};

/**
 * Busca uma categoria pelo ID.
 * @param {number} id - ID da categoria a ser buscada.
 * @returns {Promise<Category|null>} - Categoria encontrada ou null.
 */

const getCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id); //primary key no bd
        return category;
    } catch (error) {
        console.error('Erro no serviço de busca de categoria por ID: ', error);
        throw error;
    }
}

/**
 * Busca uma categoria pelo ID.
 * @param {number} id - ID da categoria a ser buscada.
 * @returns {object} updateData - Categoria encontrada ou null.
 * @returns {Promise<boolean>} - Categoria encontrada ou null.
 */

const updateCategoryById = async (id, updateData) => {
    try {
        const category = await Category.findByPk(id); //primary key no bd
        if (!category) {
            return false; // Categoria não encontrada
        }
        await category.update(updateData);
        return true;
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const erros = error.errors.map(err => ({ message: err.message, field: err.path }));
            throw { type: 'ValidationError', erros };
        }
        console.error('Erro no serviço de atualização de categoria: ', error);
        throw error;
    }
};


module.exports = {
    createCategory,
    getCategoryById,
    updateCategoryById 
};
