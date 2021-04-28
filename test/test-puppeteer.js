const JZZ = require('jzz');
const JMH = require('..')(JZZ);
const WMT = require('web-midi-test');
const puppeteer = require('puppeteer');
const url = 'file://' + __dirname + '/test.html';

global.navigator = WMT;
const midiout_a = new WMT.MidiDst('VIRTUAL MIDI-Out A');
midiout_a.receive = function(msg) { console.log('VIRTUAL MIDI-Out A received:', msg); };
midiout_a.connect();
const midiout_b = new WMT.MidiDst('VIRTUAL MIDI-Out B');
midiout_b.receive = function(msg) { console.log('VIRTUAL MIDI-Out B received:', msg); };
midiout_b.connect();
const midiout_c = new WMT.MidiDst('VIRTUAL MIDI-Out C');
midiout_c.receive = function(msg) { console.log('VIRTUAL MIDI-Out C received:', msg); };
midiout_c.connect();
midiout_c.busy = true;
const midiin_a = new WMT.MidiSrc('VIRTUAL MIDI-In A');
midiin_a.connect();
const midiin_b = new WMT.MidiSrc('VIRTUAL MIDI-In B');
midiin_b.connect();
const midiin_c = new WMT.MidiSrc('VIRTUAL MIDI-In C');
midiin_c.connect();
midiin_c.busy = true;

(async () => {
  await JZZ({ engine: 'webmidi' });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('>>', msg.text());
  });
  await JMH.enable(page);
  await page.goto(url);
  await page.waitForTimeout(1000);
  midiin_a.emit([0x9a, 0xa, 0xa]);
  midiin_b.emit([0x9b, 0xb, 0xb]);
  midiin_c.emit([0x9c, 0xc, 0xc]);
  await page.waitForTimeout(1000);
  await browser.close();
})();
