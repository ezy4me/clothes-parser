const puppeteer = require('puppeteer');

async function parseSneakerheadData(searchQuery, page) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const pageObj = await browser.newPage();
        await pageObj.goto(`https://sneakerhead.ru/search/?q=${encodeURIComponent(searchQuery)}&page=${page}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const products = await pageObj.evaluate(() => {
            const products = [];
            let productId = 1;
            document.querySelectorAll('.product-card').forEach((element) => {
                const link = "https://sneakerhead.ru/" + element.querySelector('a.product-card__link').getAttribute('href');
                const name = element.querySelector('.product-card__title').textContent.trim();
                const price = element.querySelector('.product-card__price span').textContent.trim().replace(/[₽\s]/g, '');
                const image = "https://sneakerhead.ru" + element.querySelector('source').getAttribute('data-srcset').split(',')[0].slice(0, -3);
                products.push({ id: productId, name, price: parseInt(price), link, image });
                productId++;
            });
            return products;
        });

        await browser.close();
        return products;
    } catch (error) {
        console.error('Ошибка при парсинге данных с Sneakerhead:', error);
        return [];
    }
}

module.exports = parseSneakerheadData;
