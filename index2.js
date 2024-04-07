const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
selectedBeach = 'camboinhas';
const myurl = `https://pt.windfinder.com/forecast/${selectedBeach}`;
const PORT = 3000;

app.get("/posts", async (req, res) => {
    try {
        const waves = await waveScrapper();
        res.status(200).json({waves});
    } catch (error) {
        res.status(500).json({
            message: "Error fetching waves"
        })
    }
})

async function waveScrapper() {
    const response = await axios(myurl);
    const html = response.data;
    const $ = cheerio.load(html);
    const waves = [];

    $(".cell-waves-2.weathertable__cellgroup").each(function (){
        const waveHeight = $(this).find("span").text();
        waves.push({
            waveHeight
        });
    });

    return waves;
}

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});