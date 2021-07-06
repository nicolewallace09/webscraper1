const puppeteer = require("puppeteer");
const cheerio = require("cheerio"); 
const ObjectsToCsv = require("objects-to-csv"); 

/*
Example data 
const data = {
    [
        title: "Luca",
        year: "2021", 
        imdbRating: "7.6",
        url: "http://"., 
    ]
}
 */

const url = 'https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm'; 

// let data = {};

async function createCsv (data) {
    let csv = new ObjectsToCsv(data); 
    // saving 
    await csv.toDisk('./imdbScraper.csv'); 
}

async function imdbScraper () {
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage(); 
    await page.goto(url); 
    const html = await page.content();
    const $ = cheerio.load(html); 

    const results = $('tr').map((index, element) => {
        // title
        const titleElement = $(element).find('.titleColumn > a');
        const title = $(titleElement).text(); 

        // year
        const yearElement = $(element).find('.titleColumn > span');
        const year = (yearElement).text().replace('(','').replace(')', '');  

        // imdbRating
        const ratingRating = $(element).find('.imdbRating > strong'); 
        const rating = (ratingRating).text(); 

        // url
        const urlElement = $(element).find('.titleColumn > a'); 
        const urlAttr = (urlElement).attr('href'); 
        const url = "http://imdb.com" + urlAttr;

        return { title, year, rating, url};

    }).get(); 
    // console.log(results);

    await createCsv(results); 

    await browser.close(); 
}

imdbScraper();
