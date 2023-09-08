// Main browser code
import htmx from 'htmx.org';

console.log('hello');

// import 'htmx.org/dist/ext/json-enc';
// At the moment the above import is not working, due to:
// https://github.com/bigskysoftware/htmx/issues/1469
// So I just copied the extension here directly.
htmx.defineExtension('json-enc', {
  onEvent: function (name, evt) {
    if (name === 'htmx:configRequest') {
      evt.detail.headers['Content-Type'] = 'application/json';
    }
  },

  encodeParameters: function (xhr, parameters, elt) {
    xhr.overrideMimeType('text/json');
    return JSON.stringify(parameters);
  },
});

import './index.css';
