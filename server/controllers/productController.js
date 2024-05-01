const { Product, ProductPrice } = require("../database/models");
const ApiError = require("../error/ApiError");
const sequelize = require('../database/db')
const { Op } = require('sequelize');

const parseLamodaData = require('../parser/parseLamodaData');
const parseBrandshopData = require('../parser/parseBrandshopData');
const parseSneakerheadData = require('../parser/parseSneakerheadData');

const parseLamodaProduct = require('../parser/parseLamodaProduct');
const parseBrandshopProduct = require("../parser/parseBrandshopProduct");
const parseSneakerheadProduct = require("../parser/parseSneakerheadProduct");


class ProductController {
    async create(req, res, next) {
        try {
            const searchQuery = req.query.q;
            const page = req.query.page || 1;

            const [lamodaData, brandshopData, sneakerheadData] = await Promise.all([
                parseLamodaData(searchQuery, page),
                parseBrandshopData(searchQuery, page),
                parseSneakerheadData(searchQuery, page)
            ]);


            await Promise.all([
                ProductController.createProducts(lamodaData, 'Lamoda'),
                ProductController.createProducts(brandshopData, 'Brandshop'),
                ProductController.createProducts(sneakerheadData, 'Sneakerhead')
            ]);

            return res.json({ success: true });
        } catch (e) {
            return next(ApiError.InternetServerError(e.message));
        }
    }

    static async createProducts(productsData, source) {
        const productsToCreate = [];
        const pricesToCreate = [];

        for (const item of productsData) {
            const existingProduct = await Product.findOne({ where: { name: item.name, source, link: item.link } });
            if (!existingProduct) {
                const newProduct = await Product.create({
                    name: item.name,
                    source: source,
                    link: item.link,
                    image: item.image
                });

                productsToCreate.push(newProduct);

                pricesToCreate.push({
                    productId: newProduct.id,
                    price: item.price,
                    date: new Date().setHours(0, 0, 0, 0)
                });
            }
        }

        if (productsToCreate.length > 0) {
            const transaction = await sequelize.transaction();
            try {
                await ProductPrice.bulkCreate(pricesToCreate, { transaction });
                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
    }


    static async parseAllData(searchQuery, page) {
        const [lamodaData, brandshopData, sneakerheadData] = await Promise.allSettled([
            parseLamodaData(searchQuery, page),
            parseBrandshopData(searchQuery, page),
            parseSneakerheadData(searchQuery, page)
        ]);

        const errors = [lamodaData, brandshopData, sneakerheadData].filter(result => result.status === 'rejected').map(result => result.reason);
        if (errors.length > 0) {
            throw new ApiError.InternetServerError(errors.map(error => error.message).join('; '));
        }

        await Promise.allSettled([
            ProductController.createProducts(lamodaData.value, 'Lamoda'),
            ProductController.createProducts(brandshopData.value, 'Brandshop'),
            ProductController.createProducts(sneakerheadData.value, 'Sneakerhead')
        ]);

        return { lamoda: lamodaData.value, brandshop: brandshopData.value, sneakerhead: sneakerheadData.value };
    }

    async getAll(req, res, next) {
        try {
            const { q: searchQuery, page = 1 } = req.query;

            const data = await ProductController.parseAllData(searchQuery, page);

            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { link } = req.query;
            const product = await Product.findOne({
                where: { link },
                include: 'prices'
            });

            let parsedProduct = {}
            if (product.source === 'Lamoda')
                parsedProduct = await parseLamodaProduct(product.link)
            if (product.source === 'Brandshop')
                parsedProduct = await parseBrandshopProduct(product.link)
            if (product.source === 'Sneakerhead')
                parsedProduct = await parseSneakerheadProduct(product.link)

            parsedProduct.prices = product.prices.map(price => ({ price: price.price, date: price.date }));


            return res.json(parsedProduct);
        } catch (e) {
            return next(ApiError.InternetServerError(e.message));
        }
    }

}

module.exports = new ProductController();