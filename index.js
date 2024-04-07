const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const fs = require('fs');

console.log('Web Scrapper de Ondas');

async function app() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    selectedBeach = 'camboinhas';
    const myurl = `https://pt.windfinder.com/forecast/${selectedBeach}`;
    await page.goto(myurl);

    // Pega o 1º valor da Classe de altura de ondas e retorna para a variável waveH
    const waveH = await page.evaluate(() => {
        return document.getElementsByClassName('units-wh')[0].childNodes[0].nodeValue;
    });

    console.log(`A altura prevista pras ondas hoje é de ${waveH} m.`);

    const data = `const data = [${waveH}];`;
    //Escreve os dados em um arquivo local (JavaScript)
    fs.writeFile('waves.js', data, err => {
        if(err) throw new Error('Something went wrong')

        console.log('Done')
    });

    await browser.close();
}

app();