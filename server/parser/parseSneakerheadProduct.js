const puppeteer = require('puppeteer');

async function parseSneakerheadProduct(link) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const pageObj = await browser.newPage();
        await pageObj.goto(`${link}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

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
            const images = Array.from(document.querySelectorAll('.product__images-content img'));
            const uniqueImageSrcs = Array.from(new Set(images.map(img => 'https://sneakerhead.ru' + img.getAttribute('src'))));

            const brand = document.querySelector('.product__title a').textContent.trim();
            const productName = document.querySelector('.product__title').textContent.trim();
            const sizes = Array.from(document.querySelectorAll('.product-sizes__list.is-visible .product-sizes__button')).map(size => size.textContent.trim());
            const price = document.querySelector('.product__price-value').textContent.trim();

            return { brand, name: productName, price, sizes, images: uniqueImageSrcs};
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Ошибка при парсинге данных с Sneakerhead:', error);
        return {};
    }
}

module.exports = parseSneakerheadProduct;
