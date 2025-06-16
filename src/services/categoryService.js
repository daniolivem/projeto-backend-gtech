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

module.exports = { createCategory };

 