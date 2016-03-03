require('./traceur-runtime');

import fs from 'fs';
import util from 'util';

import _ from 'lodash';

import orderTables from './transformers/orderTables';
import toPostgreSQL from './transformers/postgreSQL/toPostgreSQL';

import {loadGrammarWithSemantics, runFromFile} from './ohmLoader';

const {grammar, semantics} = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm');

let i = 2;
if (process.argv[0].endsWith('relational_modeler')) i = 1;

console.log(process.argv);

const model = runFromFile(process.argv[i], grammar, semantics, 'toObject');

// log(util.inspect(model, false, null));

log(toPostgreSQL(orderTables(model)).join('\n'));

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object': return util.inspect(arg, {showHidden: true, depth: null});
      default: return arg;
    }
  }
}