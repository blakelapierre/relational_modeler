'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; // require('../traceur-runtime');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _GrammarError = require('../GrammarError');

var _GrammarError2 = _interopRequireDefault(_GrammarError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelText = _fs2.default.readFileSync('./tests/samples/usda.sr28.model').toString();

try {
  log((0, _api2.default)(modelText, 'postgresql', '^', '~').schema.join('\n'));
} catch (e) {
  if (e instanceof _GrammarError2.default) {
    console.log(e.match.message);
  } else console.error(e);
}

function log() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
      case 'object':
        return _util2.default.inspect(arg, { showHidden: true, depth: null });
      default:
        return arg;
    }
  }
}