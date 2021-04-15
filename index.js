module.exports = function(JZZ) {
  if (!JZZ) JZZ = require('jzz');

  function reset(ins, outs) {
    var i;
    for (i = 0; i < ins.length; i++) if (ins[i]) ins[i].disconnect().close();
    for (i = 0; i < outs.length; i++) if (outs[i]) outs[i].close();
    ins = [];
    outs = [];
  }

  async function setup_puppeteer(page) {
    var ins = [];
    var outs = [];
    page.on('load', () => { reset(ins, outs); });
    async function sendData(data) {
      await page.evaluate((s) => {
        jazz_midi_headless_write(s);
      }, JSON.stringify(data));
    }
    async function onRequest(req) {
      var i, data;
      var request = req[0];
      if (request == 'refresh') {
        var info = await JZZ().refresh().info();
        var data = ['refresh', { ins: [], outs: [] }];
        for (i = 0; i < info.inputs.length; i++) data[1].ins.push({ name: info.inputs[i].name });
        for (i = 0; i < info.outputs.length; i++) data[1].outs.push({ name: info.outputs[i].name });
        sendData(data);
        return;
      }
      var idx = req[1];
      req = req.slice(2);
      if (request == 'play') {
        if (outs[idx]) outs[idx].send(req);
        return;
      }
      if (request == 'openout') {
        var port = await JZZ().openMidiOut(req[2]);
        outs[idx] = port;
        sendData([request, idx, req[0]]);
        return;
      }
      if (request == 'closeout') {
        if (outs[idx]) {
          outs[idx].close();
          outs[idx] = undefined;
        }
      }
      console.log('request:', request, idx, req);
    }
    await page.exposeFunction('jazz_midi_headless_request', onRequest);
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
        jazz_midi_headless_write('["version",0,0]');
      }
      document.addEventListener('jazz-midi', jazz_midi_headless_init);
    });
  }
  return {
    setup: setup_puppeteer
  }
}
