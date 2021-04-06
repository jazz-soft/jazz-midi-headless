const JZZ = require('jzz');
const jmh = require('..')(JZZ);
const puppeteer = require('puppeteer');
const url = 'file://' + __dirname + '/test.html';

function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('>>', msg.text()));
  await jmh.setup(page);
  await page.goto(url);
  await timeout(200);
  await browser.close();
})();
