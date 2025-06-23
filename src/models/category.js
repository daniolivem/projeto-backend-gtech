
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    // Método para inicializar o modelo e suas configurações

    static associate(models) {
      /**
       * Aqui podemos criar relacionamentos com outras tabelas, se necessário.
       * Por exemplo: Category.hasMany(Product);
     */
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory, // Modelo da tabela de junção
        foreignKey: 'category_id',       // Chave em ProductCategory que se refere a Category
        otherKey: 'product_id',          // Chave em ProductCategory que se refere a Product
        as: 'products'                   // Alias para acessar os produtos da categoria
      });
    }
  }

  Category.init({
    // Campo 'name' - Nome da categoria
    name: {
      type: DataTypes.STRING, // Tipo de dado: texto
      allowNull: false, /// Não permite valores nulos
      validate: {
        notEmpty: { msg: 'O nome da categoria não pode ser vazio.' } // Mensagem de erro se vazio
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este slug já está em uso.'
      },
      validate: {
        notEmpty: { msg: 'O slug da categoria não pode ser vazio.' }
        // Poderia adicionar validação para formato de slug (ex: apenas letras minúsculas, números e hífens)
      }
    },
    // Campo 'use_in_menu' - Indica se a categoria será exibida no menu
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Valor padrão false (0)
      validate: {
        isIn: { // Garante que seja true ou false
          args: [[true, false]],
          msg: 'O valor para use_in_menu deve ser verdadeiro ou falso.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true // Cria automáticamente as colunas createdAt e updatedAt
  });
  return Category;
};
