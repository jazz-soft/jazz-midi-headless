# jazz-midi-headless

MIDI for headless testing

[![npm](https://img.shields.io/npm/v/jazz-midi-headless.svg)](https://www.npmjs.com/package/jazz-midi-headless)
[![build](https://github.com/jazz-soft/jazz-midi-headless/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/jazz-midi-headless/actions)

## Puppeteer

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

## Playwright

```js
const JZZ = require('jzz');
const JMH = require('jazz-midi-headless')(JZZ);
const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await JMH.enable(page);
    await page.goto('test.html');
    // ...
  }
})();
```

## Virtual ports

Normally, **jazz-midi-headless** sees all regular MIDI ports available on your system
via the **JZZ** and **jazz-midi**.  
You can create virtual MIDI ports and (optionally) hide the regular ones.

### Using JZZ virtual ports:

```js
const JZZ = require('jzz');
const JMH = require('jazz-midi-headless')(JZZ);

const virtual_midi_out = new JZZ.Widget();
JZZ.addMidiOut('VIRTUAL MIDI-Out', virtual_midi_out);
virtual_midi_out.connect(function(msg) { console.log('MIDI received: ' + msg); });

const virtual_midi_in = new JZZ.Widget();
JZZ.addMidiIn('VIRTUAL MIDI-In', virtual_midi_in);

JZZ({ engine: 'none' });
// ...
virtual_midi_in.noteOn(0, 'C#5', 127);
// ...
```

### Using web-midi-test virtual ports:

```js
const JZZ = require('jzz');
const JMH = require('jazz-midi-headless')(JZZ);
const WMT = require('web-midi-test');

const virtual_midi_out = new WMT.MidiDst('VIRTUAL MIDI-Out');
virtual_midi_out.connect();
virtual_midi_out.receive = function(msg) { console.log('MIDI received:', msg); };

const virtual_midi_in = new WMT.MidiSrc('VIRTUAL MIDI-In');
virtual_midi_in.connect();

global.navigator = WMT;

JZZ({ engine: 'webmidi' });
// ...
virtual_midi_in.emit([0x90, 0x61, 0x7f]);
// ...
```

Please check the [**test**](https://github.com/jazz-soft/jazz-midi-headless/tree/main/test) directory for more examples.