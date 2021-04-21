module.exports = function(JZZ) {
  if (!JZZ) JZZ = require('jzz');

  function reset(ins, outs) {
    var i;
    for (i = 0; i < ins.length; i++) if (ins[i]) ins[i].disconnect().close();
    for (i = 0; i < outs.length; i++) if (outs[i]) outs[i].close();
    ins = [];
    outs = [];
  }

  async function enable_puppeteer(page) {
    var ins = [];
    var outs = [];
    var count = 0;
    page.on('load', () => { reset(ins, outs); });
    async function sendData(data) {
      try {
        await page.evaluate((s) => {
          window.jazz_midi_headless_write(s);
        }, JSON.stringify(data));
      }
      catch(e) {/**/}
    }
    async function jazz_midi_headless_request(req) {
      var i, data;
      var request = req[0];
      if (request == 'refresh') {
        var info = await JZZ().refresh().info();
        data = ['refresh', { ins: [], outs: [] }];
        for (i = 0; i < info.inputs.length; i++) data[1].ins.push({ name: info.inputs[i].name });
        for (i = 0; i < info.outputs.length; i++) data[1].outs.push({ name: info.outputs[i].name });
        sendData(data);
        return;
      }
      if (request == 'new') {
        count++;
        sendData(['version', count, 0]);
        return;
      }
      var idx = req[1];
      req = req.slice(2);
      if (request == 'play') {
        if (outs[idx]) outs[idx].send(req);
        return;
      }
      if (request == 'openin') {
        await JZZ().openMidiIn(req[0]).or(function() {
          sendData([request, idx, ins[idx] ? ins[idx].name() : undefined]);
        }).and(function() {
          if (ins[idx]) ins[idx].close();
          ins[idx] = this;
          this.connect(function(msg) {
            sendData(['midi', idx, 0].concat(msg.slice()));
          });
          sendData([request, idx, req[0]]);
        });
        return;
      }
      if (request == 'openout') {
        await JZZ().openMidiOut(req[0]).or(function() {
          sendData([request, idx, outs[idx] ? outs[idx].name() : undefined]);
        }).and(function() {
          if (outs[idx]) outs[idx].close();
          outs[idx] = this;
          sendData([request, idx, req[0]]);
        });
        return;
      }
      if (request == 'closein') {
        if (ins[idx]) {
          ins[idx].close();
          ins[idx] = undefined;
        }
      }
      if (request == 'closeout') {
        if (outs[idx]) {
          outs[idx].close();
          outs[idx] = undefined;
        }
      }
      //console.log('request:', request, idx, req);
    }
    await page.exposeFunction('jazz_midi_headless_request', jazz_midi_headless_request);
    await page.evaluateOnNewDocument(() => {
      var jazz_midi_headless_data;
      window.jazz_midi_headless_write = function(s) {
        jazz_midi_headless_data.innerText += s + '\n';
        document.dispatchEvent(new Event('jazz-midi-msg'));
      }
      function jazz_midi_headless_init() {
        document.removeEventListener('jazz-midi', jazz_midi_headless_init);
        jazz_midi_headless_data = document.createElement('div');
        jazz_midi_headless_data.id = 'jazz-midi-msg';
        document.body.appendChild(jazz_midi_headless_data);
        document.addEventListener('jazz-midi', (evt) => { jazz_midi_headless_request(evt.detail); });
        window.jazz_midi_headless_write('["version",0,0]');
      }
      document.addEventListener('jazz-midi', jazz_midi_headless_init);
    });
  }
  return {
    enable: enable_puppeteer
  }
}
