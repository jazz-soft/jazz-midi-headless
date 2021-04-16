const JZZ = require('jzz');
const jmh = require('..')(JZZ);
const puppeteer = require('puppeteer');
const url = 'file://' + __dirname + '/test.html';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('>>', msg.text()));
  await jmh.setup(page);
  await page.goto(url);
  await page.waitForTimeout(5000);
  await browser.close();
})();
