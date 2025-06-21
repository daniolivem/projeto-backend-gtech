'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
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
        notEmpty: { msg: 'O nome da categoria não pode ser vazio.' },
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este slug já está em uso.',
      },
      validate: {
        notEmpty: { msg: 'O slug da categoria não pode ser vazio.' },
      }
    },
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: { args: [[true, false]], msg: 'O valor para use_in_menu deve ser verdadeiro ou falso.' },
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true
});
return Category;
};