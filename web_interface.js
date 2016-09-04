'use strict';

var _orderTables = require('./transformers/orderTables');

var _orderTables2 = _interopRequireDefault(_orderTables);

var _toPostgreSQL = require('./transformers/postgreSQL/toPostgreSQL');

var _toPostgreSQL2 = _interopRequireDefault(_toPostgreSQL);

var _ohmJs = require('ohm-js');

var _ohmJs2 = _interopRequireDefault(_ohmJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var modelArea = document.getElementsByTagName('modelarea')[0],
      modelAreaTextArea = modelArea.getElementsByTagName('textarea')[0];

  modelAreaTextArea.addEventListener('change', function (first, second, third) {
    return console.log(first, second, third);
  });
});
// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

function loadGrammarWithSemantics(grammarName) {
  var semanticNames = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var grammarText = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  var grammar = _ohmJs2.default.grammars(grammarText)[grammarName],
      semantics = grammar.semantics();

  semanticNames.forEach(addSemanticName);

  return { grammar: grammar, semantics: semantics };

  function addSemanticName(name) {
    var s = require('./grammar/' + grammarName + '.' + name + '.semantics').default;
    semantics.addOperation(name, s);
  }
}