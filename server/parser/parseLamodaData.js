const puppeteer = require('puppeteer');

async function parseLamodaData(searchQuery, page) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const pageObj = await browser.newPage();
        await pageObj.goto(`https://www.lamoda.ru/catalogsearch/result/?q=${encodeURIComponent(searchQuery)}&submit=y&gender_section=men&page=${page}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await pageObj.evaluate(async () => {
            await new Promise(resolve => {
                let totalHeight = 0;
                const distance = 100;
                const scrollInterval = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(scrollInterval);
                        resolve();
                    }
                }, 100);
            });
        });


        const data = await pageObj.evaluate(() => {
            const products = [];
            let productId = 1;

            document.querySelectorAll('.x-product-card__card').forEach((element) => {
                const link = "https://www.lamoda.ru" + element.querySelector('a').getAttribute('href');
                const name = element.querySelector('.x-product-card-description__product-name').textContent.trim();
                const newPriceElement = element.querySelector('.x-product-card-description__price-new');
                let price = newPriceElement ? newPriceElement.textContent.trim().replace(/[₽\s]/g, '') : '';

                if (price === '') {
                    const singlePriceElement = element.querySelector('.x-product-card-description__price-single');
                    price = singlePriceElement ? singlePriceElement.textContent.trim().replace(/[₽\s]/g, '') : '';
                }

                const imageSrcElement = element.querySelector('.x-product-card__pic-img');
                const imageSrc = imageSrcElement ? imageSrcElement.getAttribute('src') : '';

                const image = imageSrc ? "https:" + imageSrc : "";

                products.push({ id: productId, name, price: parseInt(price), link, image });
                productId++;
            });
            return products;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Ошибка при парсинге данных с Lamoda:', error);
        return [];
    }
}

module.exports = parseLamodaData;
