'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      ProductCategory.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      ProductCategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }

  }
  ProductCategory.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductCategory'
  });
  return ProductCategory;
};