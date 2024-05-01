const sequelize = require('./db')
const { DataTypes } = require('sequelize')

const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true },
    source: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
})

const ProductPrice = sequelize.define('product_price', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATE, defaultValue: Date.now() },
})

Product.hasMany(ProductPrice, { as: 'prices' }); 
ProductPrice.belongsTo(Product); 

module.exports = {
    Product,
    ProductPrice
}