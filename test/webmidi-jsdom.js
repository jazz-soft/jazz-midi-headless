const JZZ = require('jzz');
const JMH = require('..')(JZZ);
const JSDOM = require('jsdom').JSDOM;
const url = __dirname + '/webmidi.html';

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

function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

(async () => {
  await JZZ({ engine: 'webmidi' });
  const dom = await JSDOM.fromFile(url, {
    resources: 'usable',
    runScripts: 'dangerously',
    beforeParse: window => { JMH.enable(window); }
  });
  await timeout(100);
  midiin_a.noteOn(0, 'C5', 127);
  await timeout(100);
  midiin_b.noteOn(0, 'C6', 127);
  await timeout(100);
  dom.window.close();
})();
