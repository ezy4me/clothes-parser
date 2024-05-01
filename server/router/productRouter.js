const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router
    .get('/link/', productController.getOne)
    .get('/', productController.getAll)
    .post('/', productController.create)

module.exports = router;