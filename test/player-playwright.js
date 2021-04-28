const JZZ = require('jzz');
const JMH = require('..')(JZZ);
const playwright = require('playwright');
const url = 'file://' + __dirname + '/player.html';

(async () => {
  var done;
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    console.log('Testing on', browserType);
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('console', msg => {
      console.log('>>', msg.text());
      if (msg.text() == 'Done!') done();
    });
    await JMH.enable(page);
    await page.goto(url);
    await new Promise((resolve) => { done = resolve; });
    browser.close();
  }
})();
