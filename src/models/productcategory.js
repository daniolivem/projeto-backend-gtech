// src/models/productcategory.js (ou nome similar)
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
    
    }
  }
  ProductCategory.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Importante para o Sequelize reconhecer como parte da PK
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Importante para o Sequelize reconhecer como parte da PK
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProductCategory',
    timestamps: true // Mantendo timestamps para a tabela de junção
  });
  return ProductCategory;
};