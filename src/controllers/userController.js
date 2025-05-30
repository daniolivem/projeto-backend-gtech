const jwt = require('jsonwebtoken');
const { User } = require('../models');

const userService = require('../services/userService');

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'ID de usuário inválido.' });
        }
        const user = await userService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Erro no controller ao buscar usuário por ID:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
};

const createUser = async (req, res) => {
    try {
        const { firstname, surname, email, password, confirmPassword } = req.body;

        if (!firstname || !surname || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos: firstname, surname, email, password, confirmPassword.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não coincidem.' }); // Mensagem corrigida
        }

        const newUser = await userService.createUser({
            firstname,
            surname,
            email,
            password
        });

        const userResponse = newUser.toJSON();
        delete userResponse.password;
        return res.status(201).json(userResponse);
    } catch (error) {
        if (error.type === 'ValidationError') { // Corrigido de 'Validation Error' para 'ValidationError' se for o nome da propriedade que você está usando
            return res.status(400).json({ message: 'Erro de validação.', errors: error.errors });
        }
        console.error('Erro no controller ao criar usuário:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar criar o usuário.' }); // Resposta 500 adicionada
    }
};

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'ID de usuário inválido.' });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        delete updateData.password;
        delete updateData.confirmPassword;

        const updatedUserInstance = await userService.updateUserById(id, updateData); // Variável renomeada

        if (updatedUserInstance === null) {
            return res.status(404).json({ message: 'Usuário não encontrado para atualização.' }); // Mensagem ajustada
        }
        return res.status(204).send(); // Mantido 204 conforme escopo
    } catch (error) {
        // No seu service, você lança { type: 'Validation Error', errors }
        // Então, a verificação aqui deve ser 'Validation Error'
        if (error.type === 'ValidationError') {
            return res.status(400).json({ message: 'Erro de validação ao atualizar usuário.', errors: error.errors });
        }
        console.error('Erro no controller ao atualizar usuário:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar atualizar o usuário.' });
    }
};

const deleteUser = async (req, res) => {
    console.log(`[CONTROLLER] INICIO deleteUser - ID:${req.params.id}`);
    try {
        const { id } = req.params;

    console.log(`[CONTROLLER] Validando ID para delete: ${id}`);
    if (isNaN(parseInt(id, 10))) {
    console.log(`[CONTROLLER] ID inválido para delete: ${id}`);
        return res.status(400).json({ message: 'ID de usuário inválido.' });
    }
    console.log(`[CONTROLLER] Chamando userService.deleteUserById...`);
    const wasDeleted = await userService.deleteUserById(id);
    console.log(`[CONTROLLER] userService.deleteUserById retornou: ${wasDeleted}`);

    if (!wasDeleted) {
        console.log(`[CONTROLLER] Usuário não encontrado para deleção (serviço retornou false).`);
        return res.status(404).json({ message: 'Usuário não encontrado para deleção.' });
    } 
console.log(`[CONTROLLER] Usuário deletado com sucesso.`);
        return res.status(204).send(); // Mantido 204 conforme escopo do projeto
        
    }catch (error) {
    console.error('----------------------------------------------------------');
    console.error('[CONTROLLER] !!! ERRO CAPTURADO NO CONTROLLER (deleteUser) !!!');
    console.error('[CONTROLLER] Tipo do Erro:', typeof error);
    console.error('[CONTROLLER] Nome do Erro:', error ? error.name : 'N/A');
    console.error('[CONTROLLER] Mensagem do Erro:', error ? error.message : 'N/A');
    console.error('[CONTROLLER] Objeto Erro Completo:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('[CONTROLLER] Stack Trace do Erro:', error ? error.stack : 'N/A');
    console.error('----------------------------------------------------------');
    
    console.log('[CONTROLLER] Enviando resposta genérica 500 (deleteUser).');
    return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar deletar o usuário.' });

    }
};

/**
 * Autentica o usuário com base nos dados fornecidos, e gera um token JWT.
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica se o email e a senha foram fornecidos
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        // Verifica se o usuário existe no banco de dados
        const user = await User.findOne({ where: { email} });
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        // Verifica se a senha está correta
        const isPasswordValid = await user.validPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        // Retorna o token e dados do usuário (omitindo a senha)
        return res.status(200).json({
            message: 'Login bem-sucedido',
            token,
           
        })
    } catch (error) {
        console.error('Erro no controller ao fazer login:', error);
        return res.status(500).json({ message: 'Ocorreu um erro interno ao tentar fazer login.' });
    }
}

module.exports = {
    getUserById,
    createUser,
    updateUserById,
    deleteUser,
    loginUser //  Adicionado para exportar a função de login
};