const puppeteer = require('puppeteer');

async function parseLamodaProduct(link) {
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
            const galleryContainer = document.querySelector('._gallery_1ut57_52');
            const images = Array.from(galleryContainer.querySelectorAll('img._root_1wiwn_3._image_1fied_2._image_1fied_2'));
            const imageSrcs = images.map(img => img.src);

            const brand = document.querySelector('.product-title__brand-name').textContent.trim();
            const productName = document.querySelector('._modelName_1lw0e_21').textContent.trim();
            const price = document.querySelector('._pricesInfo_1ut57_136 ._price_fow3x_11').textContent.trim();
            const sizes = Array.from(document.querySelectorAll('._sizes_1ut57_166 ._colspanMain_8karg_182 ._firstRow_8karg_194')).map(size => size.textContent.trim());

            return { brand, name: productName, price, sizes, images: imageSrcs };
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Ошибка при парсинге данных с Lamoda:', error);
        return {};
    }
}

module.exports = parseLamodaProduct;
