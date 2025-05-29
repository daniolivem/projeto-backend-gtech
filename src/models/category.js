// src/models/category.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Defina associações aqui no futuro, por exemplo:
      // Category.belongsToMany(models.Product, { through: 'ProductCategories' });
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,   // Modelo da tabela de junção
        foreignKey: 'category_id',       // Chave em ProductCategory que se refere a Category
        otherKey: 'product_id',          // Chave em ProductCategory que se refere a Product
        as: 'products'                   // Alias para acessar os produtos da categoria
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O nome da categoria não pode ser vazio.' }
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
    // tableName: 'Categories', // Opcional
    timestamps: true
  });
  return Category;
};