const JZZ = require('jzz');
const JMH = require('..')(JZZ);
const JSDOM = require('jsdom').JSDOM;
const url = __dirname + '/player.html';

(async () => {
  await JSDOM.fromFile(url, {
    resources: 'usable',
    runScripts: 'dangerously',
    beforeParse: window => { JMH.enable(window); }
  });
})();
