"use strict";
var $__util__,
    $__lodash__,
    $___46__46__47_transformers_47_orderTables__,
    $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__,
    $___46__46__47_ohmLoader__;
require('../traceur-runtime');
var util = ($__util__ = require("util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}).default;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
var orderTables = ($___46__46__47_transformers_47_orderTables__ = require("../transformers/orderTables"), $___46__46__47_transformers_47_orderTables__ && $___46__46__47_transformers_47_orderTables__.__esModule && $___46__46__47_transformers_47_orderTables__ || {default: $___46__46__47_transformers_47_orderTables__}).default;
var toPostgreSQL = ($___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__ = require("../transformers/postgreSQL/toPostgreSQL"), $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__ && $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__.__esModule && $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__ || {default: $___46__46__47_transformers_47_postgreSQL_47_toPostgreSQL__}).default;
var $__4 = ($___46__46__47_ohmLoader__ = require("../ohmLoader"), $___46__46__47_ohmLoader__ && $___46__46__47_ohmLoader__.__esModule && $___46__46__47_ohmLoader__ || {default: $___46__46__47_ohmLoader__}),
    loadGrammarWithSemantics = $__4.loadGrammarWithSemantics,
    runFromFile = $__4.runFromFile;
var $__7 = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm'),
    grammar = $__7.grammar,
    semantics = $__7.semantics;
var model = runFromFile('./tests/samples/personal.model', grammar, semantics, 'toObject');
log(toPostgreSQL(orderTables(model)).join('\n'));
function log() {
  for (var args = [],
      $__6 = 0; $__6 < arguments.length; $__6++)
    args[$__6] = arguments[$__6];
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
