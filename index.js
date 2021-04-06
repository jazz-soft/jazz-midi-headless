module.exports = function(JZZ) {
  if (!JZZ) JZZ = require('jzz');

  async function setup_puppeteer(page) {
    async function onRequest(req) {
      console.log('request:', req);
    }
    await page.exposeFunction('jazz_midi_headless_request', onRequest);
    await page.evaluateOnNewDocument(() => {
      var jazz_midi_headless_data;
      function jazz_midi_headless_write(s) {
        jazz_midi_headless_data.innerText += s + '\n';
      }
      function jazz_midi_headless_init() {
        document.removeEventListener('jazz-midi', jazz_midi_headless_init);
        jazz_midi_headless_data = document.createElement('div');
        jazz_midi_headless_data.id = 'jazz-midi-msg';
        document.body.appendChild(jazz_midi_headless_data);
        jazz_midi_headless_data.innerText = '["version",0]\n';
        document.addEventListener('jazz-midi', (evt) => { jazz_midi_headless_request(evt.detail); });
        document.dispatchEvent(new Event('jazz-midi-msg'));
      }
      document.addEventListener('jazz-midi', jazz_midi_headless_init);
    });
  }
  return {
    setup: setup_puppeteer
  }
}
