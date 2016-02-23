"use strict";
var $__fs__,
    $__util__,
    $__lodash__,
    $__transformers_47_orderTables__,
    $__transformers_47_postgreSQL_47_toPostgreSQL__,
    $__ohmLoader__;
require('./traceur-runtime');
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var util = ($__util__ = require("util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}).default;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
var orderTables = ($__transformers_47_orderTables__ = require("./transformers/orderTables"), $__transformers_47_orderTables__ && $__transformers_47_orderTables__.__esModule && $__transformers_47_orderTables__ || {default: $__transformers_47_orderTables__}).default;
var toPostgreSQL = ($__transformers_47_postgreSQL_47_toPostgreSQL__ = require("./transformers/postgreSQL/toPostgreSQL"), $__transformers_47_postgreSQL_47_toPostgreSQL__ && $__transformers_47_postgreSQL_47_toPostgreSQL__.__esModule && $__transformers_47_postgreSQL_47_toPostgreSQL__ || {default: $__transformers_47_postgreSQL_47_toPostgreSQL__}).default;
var $__5 = ($__ohmLoader__ = require("./ohmLoader"), $__ohmLoader__ && $__ohmLoader__.__esModule && $__ohmLoader__ || {default: $__ohmLoader__}),
    loadGrammarWithSemantics = $__5.loadGrammarWithSemantics,
    runFromFile = $__5.runFromFile;
var $__8 = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm'),
    grammar = $__8.grammar,
    semantics = $__8.semantics;
var i = 2;
if (process.argv[0].endsWith('relational_modeler'))
  i = 1;
var model = runFromFile(process.argv[i], grammar, semantics, 'toObject');
log(toPostgreSQL(orderTables(model)).join('\n'));
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
