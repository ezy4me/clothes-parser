const puppeteer = require('puppeteer');

async function parseBrandshopData(searchQuery, page) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const pageObj = await browser.newPage();
        await pageObj.goto(`https://brandshop.ru/search/?st=${encodeURIComponent(searchQuery)}&page=${page}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const products = await pageObj.evaluate(() => {
            const products = [];
            let productId = 1;
            document.querySelectorAll('.product-card').forEach((element) => {
                const productArticle = element.querySelector('a.product-card__link').getAttribute('href');

                const link = "https://brandshop.ru/" + element.querySelector('a.product-card__link').getAttribute('href');
                const name = element.querySelector('.product-card__title').textContent.trim().replace(/\s+/g, ' ');
                const price = element.querySelector('.product-card__price span').textContent.trim().replace(/[₽\s]/g, '');
                const image = `https://img.brandshop.ru/cache/products/${productArticle.split('/')[3].split('')[0]}/` + productArticle.split('/')[3] + '-0_676x676.jpg';
                products.push({ id: productId, name: name.replace(/\n/g, ''), price: parseInt(price), link, image });
                productId++;
            });
            return products;
        });

        await browser.close();
        return products;
    } catch (error) {
        console.error('Ошибка при парсинге данных с Brand Shop:', error);
        return [];
    }
}

module.exports = parseBrandshopData;
