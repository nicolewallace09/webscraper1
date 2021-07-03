const puppeteer = require('puppeteer'); 
const cheerio = require('cheerio'); 
const ObjectsToCsv = require('objects-to-csv'); 

/* sample of object trying to obtain -- CRAIGSLIST EXAMPLE 
    const data = {
        [
            title: "Technical Autonomous Vehicle Trainer",
            jobDescription: "We're the driverless car company. We're building the world's best autonomous vehicles to safely connect people to the places, things, and experiences they care about.",
            datePosted: "2018-07-13",
            url: "https://sfbay.craigslist.org/sfc/sof/d/technical-autonomous-vehicle/6642626746.html",
            hood: "SOMA / south beach",
            compensation: "23/hr"
        ]
    }
*/

const url = 'https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof'; 

async function webScraper () {
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage(); 
    await page.goto(url); 
    const html = await page.content();  
    const $ = cheerio.load(html); 

    // mapping through data - ON FRONT PAGE
    const results = $('.result-info').map((index, element) => {
        // title 
        const titleElement = $(element).find('.result-title');
        const title = $(titleElement).text(); 
        const url = $(titleElement).attr('href'); 

        // date 
        const dateElement = $(element).find('.result-date'); 
        const datePosted = $(dateElement).attr("datetime"); 

        // hood 
        const hoodElement = $(element).find('.result-hood');
        const hood = $(hoodElement).text().trim().replace('(', '').replace(')', '');

        return { title, url, datePosted, hood};
    }).get();
    console.log(results); 

    await browser.close();
}


// async function createCsv (data) {
//     let csv = new ObjectsToCsv(data);
//     // saving to file 
//     await csv.toDisk("./webscraper.csv")
// }; 

// async function csvScraper () {
//     await createCsv(webScraper)
// }

// csvScraper(); 
webScraper(); 
