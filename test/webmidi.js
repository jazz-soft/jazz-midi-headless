const JZZ = require('jzz');
const JMH = require('..')(JZZ);
const puppeteer = require('puppeteer');
const url = 'file://' + __dirname + '/webmidi.html';

const midiout_a = new JZZ.Widget();
const midiout_b = new JZZ.Widget();
const midiin_a = new JZZ.Widget();
const midiin_b = new JZZ.Widget();
JZZ.addMidiOut('VIRTUAL MIDI-Out A', midiout_a);
JZZ.addMidiOut('VIRTUAL MIDI-Out B', midiout_b);
JZZ.addMidiIn('VIRTUAL MIDI-In A', midiin_a);
JZZ.addMidiIn('VIRTUAL MIDI-In B', midiin_b);

midiout_a.connect(function(msg) { console.log('VIRTUAL MIDI-Out A received: ' + msg); });
midiout_b.connect(function(msg) { console.log('VIRTUAL MIDI-Out B received: ' + msg); });

(async () => {
  await JZZ({ engine: 'webmidi' });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('>>', msg.text());
  });
  await JMH.enable(page);
  await page.goto(url);
  await page.waitForTimeout(200);
  midiin_a.noteOn(0, 'C5', 127);
  midiin_b.noteOn(0, 'C6', 127);
  await page.waitForTimeout(2000);
  await browser.close();
})();
