// require('../traceur-runtime');

import fs from 'fs';
import util from 'util';

import _ from 'lodash';

import orderTables from '../transformers/orderTables';
import toPostgreSQL from '../transformers/postgreSQL/toPostgreSQL';

import {loadGrammarWithSemantics, runFromFile} from '../ohmLoader';

import rm_pgsql_grammar from '../grammar/RM.ohm.js';

const {grammar, semantics} = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], rm_pgsql_grammar);

// const model = runFromFile('./tests/samples/personal.model', grammar, semantics, 'toObject');
const model = runFromFile('./tests/samples/usda.sr28.model', grammar, semantics, 'toObject');

// log(util.inspect(model, false, null));

log(toPostgreSQL(orderTables(model)).schema.join('\n'));

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object': return util.inspect(arg, {showHidden: true, depth: null});
      default: return arg;
    }
  }
}