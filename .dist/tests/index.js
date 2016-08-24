'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _orderTables = require('../transformers/orderTables');

var _orderTables2 = _interopRequireDefault(_orderTables);

var _toPostgreSQL = require('../transformers/postgreSQL/toPostgreSQL');

var _toPostgreSQL2 = _interopRequireDefault(_toPostgreSQL);

var _ohmLoader = require('../ohmLoader');

var _RMOhm = require('../grammar/RM.ohm.js');

var _RMOhm2 = _interopRequireDefault(_RMOhm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../traceur-runtime');

var _loadGrammarWithSeman = (0, _ohmLoader.loadGrammarWithSemantics)('RM_PGSQL', ['toObject'], _RMOhm2.default);

var grammar = _loadGrammarWithSeman.grammar;
var semantics = _loadGrammarWithSeman.semantics;

// const model = runFromFile('./tests/samples/personal.model', grammar, semantics, 'toObject');

var model = (0, _ohmLoader.runFromFile)('./tests/samples/usda.sr28.model', grammar, semantics, 'toObject');

// log(util.inspect(model, false, null));

log((0, _toPostgreSQL2.default)((0, _orderTables2.default)(model)).schema.join('\n'));

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