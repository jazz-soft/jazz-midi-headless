const JZZ = require('jzz');
const JMH = require('..')(JZZ);
const JSDOM = require('jsdom').JSDOM;
const url = __dirname + '/player.html';

function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

(async () => {
  const dom = await JSDOM.fromFile(url, {
    resources: 'usable',
    runScripts: 'dangerously',
    beforeParse: window => { JMH.enable(window); }
  });
  await timeout(5000);
})();

//(async () => {
//  const browser = await puppeteer.launch();
//  const page = await browser.newPage();
//  page.on('console', msg => {
//    console.log('>>', msg.text());
//    if (msg.text() == 'Done!') browser.close();
//  });
//  await JMH.enable(page);
//  await page.goto(url);
//})();
