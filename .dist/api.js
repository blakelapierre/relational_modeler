'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SemanticError = exports.GrammarError = exports.api = undefined;

var _ohmJs = require('ohm-js');

var _ohmJs2 = _interopRequireDefault(_ohmJs);

var _orderTables = require('./transformers/orderTables');

var _orderTables2 = _interopRequireDefault(_orderTables);

var _toPostgreSQL = require('./transformers/postgreSQL/toPostgreSQL');

var _toPostgreSQL2 = _interopRequireDefault(_toPostgreSQL);

var _RMOhm = require('./grammar/RM.ohm.js');

var _RMOhm2 = _interopRequireDefault(_RMOhm);

var _RM_PGSQLToObject = require('./grammar/RM_PGSQL.toObject.semantics');

var _RM_PGSQLToObject2 = _interopRequireDefault(_RM_PGSQLToObject);

var _GrammarError = require('./GrammarError');

var _GrammarError2 = _interopRequireDefault(_GrammarError);

var _SemanticError = require('./SemanticError');

var _SemanticError2 = _interopRequireDefault(_SemanticError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var engines = {
  'postgresql': {
    config: {
      grammar: {
        name: 'RM_PGSQL',
        text: _RMOhm2.default
      },
      semantics: {
        'toObject': _RM_PGSQLToObject2.default
      }
    },
    generator: _toPostgreSQL2.default
  }
};

var api = function api(modelText) {
  var engine = arguments.length <= 1 || arguments[1] === undefined ? 'postgresql' : arguments[1];
  var delimiter = arguments.length <= 2 || arguments[2] === undefined ? ',' : arguments[2];
  var quote = arguments.length <= 3 || arguments[3] === undefined ? '"' : arguments[3];
  var importMethod = arguments.length <= 4 || arguments[4] === undefined ? 'psql' : arguments[4];
  return getReadyEngine(engine).generator((0, _orderTables2.default)(generateModel(modelText, engine)), delimiter, quote, importMethod);
};

exports.api = api;
exports.GrammarError = _GrammarError2.default;
exports.SemanticError = _SemanticError2.default;


function getReadyEngine(name) {
  var engine = engines[name];

  if (!engine) throw new Error('No engine with name \'' + name + '\'!');

  if (!engine.grammar) {
    var _loadGrammarWithSeman = loadGrammarWithSemantics(engine);

    var grammar = _loadGrammarWithSeman.grammar;
    var semantics = _loadGrammarWithSeman.semantics;

    engine.grammar = grammar;
    engine.semantics = semantics;
  }

  return engine;
}

function loadGrammarWithSemantics(engine) {
  var config = engine.config;


  var grammar = _ohmJs2.default.grammars(config.grammar.text)[config.grammar.name],
      semantics = grammar.semantics();

  for (var name in config.semantics) {
    semantics.addOperation(name, config.semantics[name]);
  }return { grammar: grammar, semantics: semantics };
}

function generateModel(text, engineName) {
  var _getReadyEngine = getReadyEngine(engineName);

  var grammar = _getReadyEngine.grammar;
  var semantics = _getReadyEngine.semantics;


  var match = grammar.match(text);

  if (match.succeeded()) return semantics(match).toObject();else throw new _GrammarError2.default(match);
}