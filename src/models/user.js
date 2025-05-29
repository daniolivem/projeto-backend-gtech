'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); // Precisamos do bcryptjs que instalamos

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        // Aqui você pode criar relações com outros modelos no futuro, tipo:
        // User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
        static associate(models) {}

        // Esse método serve pra checar se a senha tá certa na hora do login.
        async validPassword(password) {
            return bcrypt.compare(password, this.password);
        }
    }
    User.init({
        // O campo 'id' já é criado automaticamente pelo Sequelize.
        firstname: {
            type: DataTypes.STRING,
            allowNull: false, // Não pode ser vazio
            validate: {
                notEmpty: { msg: 'O campo primeiro nome não pode ser vazio.' },
            }
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O campo sobrenome não pode ser vazio.' },
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Garante que não vai ter dois emails iguais
            validate: {
                isEmail: { msg: 'Por favor, forneça um endereço de email válido.' },
                notEmpty: { msg: 'O campo email não pode ser vazio.' },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O campo senha não pode ser vazio.' },
                // Se quiser, pode validar o tamanho mínimo da senha aqui
                // len: {
                //   args: [6, 100],
                //   msg: 'A senha deve ter pelo menos 6 caracteres.'
                // }
            }
        }
    }, {
        sequelize,
        modelName: 'User',
        // tableName: 'Users', // O Sequelize já entende que o nome da tabela é 'Users'
        timestamps: true, // Cria os campos createdAt e updatedAt automaticamente
        hooks: {
            // Antes de criar um usuário, já criptografa a senha
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            // Antes de atualizar, só criptografa de novo se a senha mudou
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });
    return User;
};
