module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": "eslint:recommended", 
  "parserOptions": {
    "ecmaVersion": 8
  },
  "overrides": [
    {
      "files": ["jmh.js"],
      "globals": {
        "jazz_midi_headless_data": true
      }
    }
  ]
};