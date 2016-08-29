'use strict';

var _orderTables = require('../transformers/orderTables');

var _orderTables2 = _interopRequireDefault(_orderTables);

var _toPostgreSQL = require('../transformers/postgreSQL/toPostgreSQL');

var _toPostgreSQL2 = _interopRequireDefault(_toPostgreSQL);

var _ohmJs = require('ohm-js');

var _ohmJs2 = _interopRequireDefault(_ohmJs);

var _RMOhm = require('../grammar/RM.ohm.js');

var _RMOhm2 = _interopRequireDefault(_RMOhm);

var _RM_PGSQLToObject = require('../grammar/RM_PGSQL.toObject.semantics');

var _RM_PGSQLToObject2 = _interopRequireDefault(_RM_PGSQLToObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var delimiter = '^',
    quote = '~';
// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

var engines = {
  'postgresql': {
    grammar: {
      'name': 'RM_PGSQL',
      'text': _RMOhm2.default
    },
    semantics: {
      'toObject': _RM_PGSQLToObject2.default
    },
    generator: _toPostgreSQL2.default
  }
};

var currentEngine = 'postgresql';

document.addEventListener('DOMContentLoaded', function () {
  var modelArea = document.getElementsByTagName('modelarea')[0],
      modelAreaTextArea = modelArea.getElementsByTagName('textarea')[0],
      resultArea = document.getElementsByTagName('resultarea')[0],
      sqlArea = document.getElementsByTagName('sqlarea')[0],
      sqlAreaTextArea = sqlArea.getElementsByTagName('textarea')[0],
      importArea = document.getElementsByTagName('importarea')[0],
      importAreaTextArea = importArea.getElementsByTagName('textarea')[0];

  modelAreaTextArea.addEventListener('keyup', function (_ref) {
    var target = _ref.target;
    return a(target);
  });

  a(modelAreaTextArea.value);

  function a(value) {
    try {
      var _loadEngineGrammarWit = loadEngineGrammarWithSemantics(currentEngine);

      var grammar = _loadEngineGrammarWit.grammar;
      var semantics = _loadEngineGrammarWit.semantics;
      var engine = _loadEngineGrammarWit.engine;

      console.log({ grammar: grammar, semantics: semantics });

      var match = grammar.match(value);

      if (match.succeeded()) {
        var model = semantics(match).toObject();

        console.log({ model: model });

        var _processModel = processModel(engine, model);

        var schema = _processModel.schema;
        var imports = _processModel.imports;


        sqlAreaTextArea.value = schema.join('\n') + '\n';
        importAreaTextArea.value = imports.join('\n') + '\n';
      } else {
        console.log('didn\'t match!', { match: match });
      }
    } catch (e) {
      console.log('error!', e);
    }
  }
});

function processModel(engine, model) {
  return engine.generator((0, _orderTables2.default)(model), delimiter, quote);
}

function loadEngineGrammarWithSemantics(engineName) {
  var engine = engines[engineName];

  var grammar = _ohmJs2.default.grammars(engine.grammar.text)[engine.grammar.name],
      semantics = grammar.semantics();

  for (var name in engine.semantics) {
    semantics.addOperation(name, engine.semantics[name]);
  }return { grammar: grammar, semantics: semantics, engine: engine };
}
