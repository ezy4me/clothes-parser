const puppeteer = require('puppeteer');

async function parseBrandshopProduct(link) {
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
            const images = Array.from(document.querySelectorAll('.product-page__slider-wrapper .vue-photo-zoom-pro img'));
            const uniqueImageSrcs = Array.from(new Set(images.map(img => img.getAttribute('src'))));

            const brand = document.querySelector('.product-page__header-wrapper a').textContent.trim();
            const productName = document.querySelector('.product-page__header-wrapper .product-page__subheader').textContent.trim();
            const sizes = Array.from(document.querySelectorAll('.product-page__plate .product-plate__item')).map(size => size.textContent.trim().split(' ').slice(0, 2).join(' '));

            let price = '';
            const newPriceElem = document.querySelector('.product-order__price_new');
            if (newPriceElem) {
                price = newPriceElem.textContent.trim();
            } else {
                price = document.querySelector('.product-order__price-wrapper').textContent.trim();
            }
            return { brand, name: productName, price, sizes, images: uniqueImageSrcs };
        });


        await browser.close();
        return data;
    } catch (error) {
        console.error('Ошибка при парсинге данных с Brandshop:', error);
        return {};
    }
}

module.exports = parseBrandshopProduct;
