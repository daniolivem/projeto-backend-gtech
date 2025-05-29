const { User } = require('../models'); // Importa o model User do Sequelize


/**
@param {object} userData
@returns {Promise<User>}
*/
const createUser = async (userData) => {
    try {
        const newUser = await User.create(userData);
        return newUser;
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const erros = error.errors.map(err => err({ message: err.message, field: err.path }));
            throw { type: 'ValidationError', errors };
        }
        console.error('Erro no serviço de criação de usuário:', error);
        throw error;
    }
};
/**
 * Busca um usuário pelo ID e retorna os dados sem a senha.
 * @param {number} id - ID do usuário a ser encontrado.
 * @returns {Promise<User|null>} Usuário encontrado (sem senha) ou null se não existir.
 */
const findUserById = async (id) => {
    try {
        const user = await User.findByPk(id, {
            // Seleciona apenas os campos públicos, excluindo a senha
            attributes: ['id', 'firstname', 'surname', 'email', 'createdAt', 'updatedAt']
        });
        return user;
    } catch (error) {
        // Loga o erro e repassa para o controller tratar
        console.error('Erro ao buscar usuário por ID:', error);
        throw error;
    }
};

/**
 @param {number} id
 @param {object} updateData
 @returns {Promise<User|null|false>}
*/

const updateUserById = async (id, updateData) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return null;
        }
        await user.update(updateData);
        return user;
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => ({ message: err.message, field: err.path }));
            throw { type: 'ValidationError', errors };
        }
        console.error('Erro ao atualizar usuário:', error);
    }
};

 /**
 * @param {number} id - O ID do usuário a ser deletado.
 * @returns {Promise<boolean>} Retorna true se o usuário foi deletado, false se não foi encontrado.
 */
const deleteUserById = async (id) => {
  console.log(`[SERVICE] INICIO deleteUserById - ID: ${id}`); // Log para o serviço
  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.log(`[SERVICE] Usuário com ID ${id} não encontrado para deleção.`);
      return false; // Usuário não encontrado para deletar
    }
    console.log(`[SERVICE] Deletando usuário com ID ${id}...`);
    await user.destroy(); // Deleta a instância do usuário
    console.log(`[SERVICE] Usuário com ID ${id} deletado com sucesso.`);
    return true; // Sucesso na deleção
  } catch (error) {
    console.error(`[SERVICE] Erro ao deletar usuário com ID ${id}:`, error);
    throw error; // Re-lança outros erros para serem tratados pelo controller
  }
};

module.exports = {
    findUserById,
    createUser,
    updateUserById,
    deleteUserById
};
