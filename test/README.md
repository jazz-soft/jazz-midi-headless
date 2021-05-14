# jazz-midi-headless tests

Use these scripts as templates for your own tests...

## player.html

- player-jsdom.js
- player-puppeteer.js
- player-playwright.js

**Front end:** MIDI-Player (see [JZZ-gui-Player](https://github.com/jazz-soft/JZZ-gui-Player))

**Back end:** MIDI output from the page is redirected to the system's default MIDI port.  
Normally, it is **Microsoft GS Wavetable Synth** on Windows, or **Apple DLS Synth** on Mac.  
On Linux, you have to enable your own MIDI synth.

## test.html

- test-jsdom.js
- test-puppeteer.js
- test-playwright.js

**Front end:** Application tries to open all available MIDI-In and MIDI-Out ports using the [JZZ](https://github.com/jazz-soft/JZZ) API.  
It sends a MIDI message to each opened MIDI-Out port, and logs MIDI messages received from each MIDI-In port to the console.

**Back end:** [web-midi-test](https://github.com/jazz-soft/web-midi-test) is used to create three virtual MIDI-In and three virtual MIDI-Out ports.  
Of those one MIDI-In and one MIDI-Out port are "taken by another application" and should be not available to the page.  
We send a MIDI message to each virtual MIDI-In port, and log MIDI messages received by virtual MIDI-Out ports.

## webmidi.html

- webmidi-jsdom.js
- webmidi-puppeteer.js
- webmidi-playwright.js

**Front end:** Application used pure **WEB MIDI API** to open the MIDI ports.  
It sends a MIDI message to each opened MIDI-Out port, and logs MIDI messages received from each MIDI-In port to the console.

**Back end:** Virtual ports are created via the [JZZ](https://github.com/jazz-soft/JZZ) API.  
We send a MIDI message to each virtual MIDI-In port, and log MIDI messages received by virtual MIDI-Out ports.
