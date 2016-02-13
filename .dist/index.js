"use strict";
var $__util__,
    $__lodash__,
    $__transformers_47_orderTables__,
    $__transformers_47_postgreSQL_47_toPostgreSQL__,
    $__ohmLoader__;
require('./traceur-runtime');
var util = ($__util__ = require("util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}).default;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
var orderTables = ($__transformers_47_orderTables__ = require("./transformers/orderTables"), $__transformers_47_orderTables__ && $__transformers_47_orderTables__.__esModule && $__transformers_47_orderTables__ || {default: $__transformers_47_orderTables__}).default;
var toPostgreSQL = ($__transformers_47_postgreSQL_47_toPostgreSQL__ = require("./transformers/postgreSQL/toPostgreSQL"), $__transformers_47_postgreSQL_47_toPostgreSQL__ && $__transformers_47_postgreSQL_47_toPostgreSQL__.__esModule && $__transformers_47_postgreSQL_47_toPostgreSQL__ || {default: $__transformers_47_postgreSQL_47_toPostgreSQL__}).default;
var $__4 = ($__ohmLoader__ = require("./ohmLoader"), $__ohmLoader__ && $__ohmLoader__.__esModule && $__ohmLoader__ || {default: $__ohmLoader__}),
    loadGrammarWithSemantics = $__4.loadGrammarWithSemantics,
    run = $__4.run;
var $__7 = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm'),
    grammar = $__7.grammar,
    semantics = $__7.semantics;
var model = run(process.argv[1], grammar, semantics, 'toObject');
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
