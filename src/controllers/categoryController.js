const categoryService = require('../services/categoryService');

// Função assíncrona para buscar as categorias
const getCategories = async (req, res) => {
  try {
    // Extrai os parâmetros da query string
    const {limit, page, fields, use_in_menu } = req.query;

    // Chama o service para buscar as categorias
    const result = await categoryService.getCategories({
      limit,
      page,
      fields,
      use_in_menu
    })

    // Retorna a resposta com os dados da categoria com o status 200 (OK)
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    // Se algo der errado, retorna um erro 400 (Bad Request)
    return res.status(400).json({ error: 'Erro ao buscar categorias' });
  }
};

// Função assíncrona para criar uma nova categoria
const createCategory = async (req, res) => {
  try {
    // Extrai os dados da requisição
    const { name, slug, use_in_menu } = req.body;

    // Validação dos dados da requisição
    if (!name || !slug) {
      return res.status(400).json({ message: 'Campos obrigatórios não foram fornecidos' });
    }

    // Cria um objeto com os dados da categoria
    const categoryData = {
      name,
      slug,
      use_in_menu
    };

      // Chama o service para criar a categoria
      const newCategory = await categoryService.createCategory(categoryData);

      // Retorna a resposta com os dados da categoria criada com o status 201 (Created)
      return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    // Se algo der errado, retorna um erro 400 (Bad Request)
    return res.status(400).json({ message: 'Erro ao criar categoria' });
  }
}

// Função assíncrona para buscar uma categoria pelo ID
const getCategoriesById = async (req, res) => {
  try {
    // Extrai o ID da categoria da requisição
    const { id } = req.params;
    // Verifica se o ID existe e é um número
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID da categoria inválido' });
    }

    // Chama o service para buscar a categoria pelo ID
    const category = await categoryService.getCategoryById(id);

    // Verifica se a categoria foi encontrada
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Converte o objeto categoria para JSON e remove os campos createdAt e updatedAt
    const categoryResponse = category.toJSON();
    delete categoryResponse.createdAt;
    delete categoryResponse.updatedAt;

    // Retorna a resposta com os dados da categoria com o status 200 (OK)
    return res.status(200).json(categoryResponse);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    // Se algo der errado, retorna um erro 404 (Not Found)
    return res.status(404).json({ message: 'Categoria não encontrada' });
  }
}

// Função assíncrona para atualizar uma categoria pelo ID
const updateCategory = async (req, res) => {
  try {
    // Extrai o ID da categoria da requisição
    const { id } = req.params;
    const updateData = req.body;
    // Verifica se o ID é um número
    if (isNaN(parseInt(id, 10))) {
      return res.status(400).json({ message: 'ID da categoria inválido' });
    }

    // Verifica se o corpo da requisição contém os campos necessários
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Nenhum dado fornecido para atualização' });
    }

    // Chama o service para atualizar a categoria
    const updateCategoryInstance = await categoryService.updateCategory(id, updateData);
    
    // Verifica se a categoria foi encontrada
    if (updateCategoryInstance === null) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Retorna a resposta com o status 200 (OK) sem enviar o corpo da resposta
    return res.status(200).send();
  } catch (error) {
    // No service, foi lançado {type: 'ValidationError', errors}
    if (error.type === 'ValidationError') {
      return res.status(400).json({ message: 'Erro de validação ao atualizar categoria', errors: error.erros });
    }
    console.error('Erro no controller ao atualizar categoria:', error);
    return res.status(500).json({ message: 'Ocorreu um err interno ao tentar atualizar categoria.' });
  }
};

// Função assíncrona para excluir uma categoria pelo ID
const deleteCategory = async (req, res) => {
  try {
    // Extrai o ID da categoria da requisição
    const { id } = req.params;

    // Verifica se o ID é um número
    if (isNaN(parseInt(id, 10))) {
      return res.status(400).json({ message: 'ID da categoria inválido' });
    }

    // Chama o service para excluir a categoria
    const deleteCategoryInstance = await categoryService.deleteCategory(id);

    // Verifica se a categoria foi encontrada
    if (!deleteCategoryInstance) {
     return res.status(404).json({ message: 'Categoria não encontrada para exclusão' });
    }

    // Retorna a resposta com o status 204 (No Content) sem enviar o corpo da resposta
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar excluir categoria.' });
  }
}

module.exports = {
  getCategories,
  createCategory,
  getCategoriesById,
  updateCategory,
  deleteCategory,
};
