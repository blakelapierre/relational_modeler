'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGrammarWithSemanticsFromFile = loadGrammarWithSemanticsFromFile;
exports.loadGrammarWithSemantics = loadGrammarWithSemantics;
exports.run = run;
exports.runFromFile = runFromFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ohmJs = require('ohm-js');

var _ohmJs2 = _interopRequireDefault(_ohmJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadGrammarWithSemanticsFromFile(grammarName) {
  var semanticNames = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var fileName = arguments.length <= 2 || arguments[2] === undefined ? './grammar/' + grammarName + '.ohm' : arguments[2];

  return loadGrammarWithSemantics(grammarName, semanticNames, _fs2.default.readFileSync(fileName));
}

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

function run(model, grammar, semantics, operation) {
  var match = grammar.match(model);
  if (match.succeeded()) {
    var result = semantics(match).toObject();
    return result;
  } else {
    console.error(match.message);
  }
}

function runFromFile(modelFile, grammar, semantics, operation) {
  return run(_fs2.default.readFileSync(modelFile).toString(), grammar, semantics, operation);
}