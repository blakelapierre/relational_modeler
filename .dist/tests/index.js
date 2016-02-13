"use strict";
var $__fs__,
    $__util__,
    $__ohm_45_js__,
    $__lodash__,
    $___46__46__47_transformers_47_orderTables__,
    $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__;
require('../traceur-runtime');
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var util = ($__util__ = require("util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}).default;
var ohm = ($__ohm_45_js__ = require("ohm-js"), $__ohm_45_js__ && $__ohm_45_js__.__esModule && $__ohm_45_js__ || {default: $__ohm_45_js__}).default;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
var orderTables = ($___46__46__47_transformers_47_orderTables__ = require("../transformers/orderTables"), $___46__46__47_transformers_47_orderTables__ && $___46__46__47_transformers_47_orderTables__.__esModule && $___46__46__47_transformers_47_orderTables__ || {default: $___46__46__47_transformers_47_orderTables__}).default;
var toPostgreSQL = ($___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__ = require("../transformers/postgreSQL/toPostgreSQL"), $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__ && $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__.__esModule && $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__ || {default: $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__}).default;
var $__8 = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm'),
    grammar = $__8.grammar,
    semantics = $__8.semantics;
var model = run('./tests/samples/personal.model', grammar, semantics, 'toObject');
log(util.inspect(model, false, null));
log(toPostgreSQL(orderTables(model)).join('\n'));
function loadGrammarWithSemantics(grammarName) {
  var semanticNames = arguments[1] !== (void 0) ? arguments[1] : [];
  var fileName = arguments[2] !== (void 0) ? arguments[2] : ("./grammar/" + grammarName + ".ohm");
  var grammar = ohm.grammars(fs.readFileSync(fileName))[grammarName],
      semantics = grammar.semantics();
  semanticNames.forEach(addSemanticName);
  return {
    grammar: grammar,
    semantics: semantics
  };
  function addSemanticName(name) {
    semantics.addOperation(name, require(("../grammar/" + grammarName + "." + name + ".semantics")).default);
  }
}
function run(modelFile, grammar, semantics, operation) {
  var match = grammar.match(fs.readFileSync(modelFile).toString());
  if (match.succeeded()) {
    var result = semantics(match).toObject();
    return result;
  } else {
    console.error(match.message);
  }
}
function log() {
  for (var args = [],
      $__7 = 0; $__7 < arguments.length; $__7++)
    args[$__7] = arguments[$__7];
  console.log.apply(console, args.map(transformArg));
  function transformArg(arg) {
    switch ((typeof arg === 'undefined' ? 'undefined' : $traceurRuntime.typeof(arg))) {
      case 'object':
        return util.inspect(arg, {
          showHidden: true,
          depth: null
        });
      default:
        return arg;
    }
  }
}

//# sourceMappingURL=index.js.map
