# jazz-midi-headless

MIDI for headless testing

[![npm](https://img.shields.io/npm/v/jazz-midi-headless.svg)](https://www.npmjs.com/package/jazz-midi-headless)
[![build](https://github.com/jazz-soft/jazz-midi-headless/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/jazz-midi-headless/actions)

## Puppeteer
### Testing JZZ applications:

```js
const JZZ = require('jzz');
const JMH = require('jazz-midi-headless')(JZZ);
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await JMH.enable(page);
  await page.goto('test.html');
  // ...
})();
```

### Testing WebMIDI API applications:

```js
const JZZ = require('jzz');
const JMH = require('jazz-midi-headless')(JZZ);
const puppeteer = require('puppeteer');
const inject_jzz = require('fs').readFileSync(__dirname + '/node_modules/jzz/javascript/JZZ.js', 'utf8');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await JMH.enable(page);
  await page.evaluateOnNewDocument(inject_jzz);
  await page.evaluateOnNewDocument('navigator.requestMIDIAccess = JZZ.requestMIDIAccess;');
  await page.goto('test.html');
  // ...
})();
```