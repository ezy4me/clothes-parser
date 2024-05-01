require('dotenv').config()
const express = require('express');
const cors = require('cors');
const sequelize = require('./database/db')
const models = require('./database/models')
const parseLamodaData = require('./parser/parseLamodaData');
const parseBrandshopData = require('./parser/parseBrandshopData');
const parseSneakerheadData = require('./parser/parseSneakerheadData');
const router = require('./router/index')

const PORT = 3000;

const app = express();

app.use(cors());
app.use('/api', router)

app.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const page = req.query.page || 1;

        const [lamodaData, brandshopData, sneakerheadData] = await Promise.all([
            parseLamodaData(searchQuery, page),
            parseBrandshopData(searchQuery, page),
            parseSneakerheadData(searchQuery, page)
        ]);

        res.json({ lamoda: lamodaData, brandshop: brandshopData, sneakerhead: sneakerheadData });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Произошла ошибка при загрузке страницы');
    }
});

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Server has started at port', PORT))
    }
    catch (e) {
        console.log(e)
    }
}

start()

