const { Category } = require('../models');

// Busca todas as categorias
const getCategories = async (params) => {

  // Desestruturando parâmetros da query string com valores padrão
  const {
    limit = 12,
    page = 1,
    fields,
    use_in_menu
  } = params;

  // Mostra o filtro WHERE
  const query = {};

  // Se use_in_menu vier na query, filtra no banco
  if (use_in_menu !== undefined) {
    query.use_in_menu = use_in_menu === 'true'; // Converte string 'true' em booleano true
  }

  // Campos a serem retornados
  let attributes;
  if (fields) {
    attributes = fields.split(',').map(f => f.trim());
  }

  // Conta o total de categorias (sem paginação)
  const total = await Category.count({ where: query });

  let data;
  if (parseInt(limit) === -1) {
    // Se limit for = -1, retorna todos os registros de categorias
    data = await Category.findAll({
      where: query,
      attributes: attributes || undefined
    });
  } else {
    // Se limit for diferente de -1, aplica paginação
    const offset = (page - 1) * limit;
    data = await Category.findAll({
      where: query,
      attributes: attributes,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  }

  // Retorna objeto com lista de categorias e informações de paginação
  return {
    data,
    total,
    limit: parseInt(limit),
    page: parseInt(page),
  };
};

// Cria uma nova categoria
const createCategory = async (data) => {
  try {
    // Cria uma nova categoria
    const newCategory = await Category.create(data);
    return newCategory;
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error; // Repassa o erro para o controller
  }
};

// Busca uma categoria pelo ID
const getCategoryById = async (id) => {
  try {
    // Busca a categoria pelo ID
    const category = await Category.findByPk(id);
   
    // Se a categoria não for encontrada, retorna null
    if (!category) {
      return null;
    }

    return category;
  } catch (error) {
    console.error('Erro ao buscar categoria por ID:', error);
    throw error; // Repassa o erro para o controller
  }
}

// Atualiza uma categoria pelo ID
const updateCategory = async (id, data) => {
  try {
   // Busca a categoria pelo ID
    const category = await Category.findByPk(id);

    // Se a categoria não for encontrada, retorna null
    if (!category) {
      return null;
    }

    // Atualiza os dados da categoria
    const updatedCategory = await category.update(data);
    // Retorna a categoria atualizada
    return updatedCategory;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map(err => err({ message: err.message, field: err.path }));
      throw { type: 'ValidationError', erros };
    }
  }
};

// Deleta uma categoria pelo ID
const deleteCategory = async (id) => {
  try {
    // Busca a categoria pelo ID
    const category = await Category.findByPk(id);

    // Se a categoria não for encontrada, retorna um false
   if (!category) {
     console.log('Categoria não encontrada');
     return false; // Retorna false se a categoria não for encontrada
   }

    // Deleta a categoria
    await category.destroy();
    return true; // Retorna true se a categoria foi deletada com sucesso
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error; // Repassa o erro para o controller
  }
}


module.exports = {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
}
