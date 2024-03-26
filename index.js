const puppeteer = require('puppeteer');

console.log('Web Scrapper de Ondas');

async function app() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const praia = 'camboinhas';
    const myurl = `https://pt.windfinder.com/forecast/${praia}`;
    await page.goto(myurl);
    await page.screenshot({path: 'example.png'});

    await browser.close();
}

app();