const JZZ = require('jzz');
const jmh = require('..')(JZZ);
const puppeteer = require('puppeteer');
const url = 'file://' + __dirname + '/player.html';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('>>', msg.text());
    if (msg.text() == 'Done!') browser.close();
  });
  await jmh.setup(page);
  await page.goto(url);
})();
