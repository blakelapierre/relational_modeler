require('../traceur-runtime');

import util from 'util';

import _ from 'lodash';

import orderTables from '../transformers/orderTables';
import toPostgreSQL from '../transformers/postgreSQL/toPostgreSQL';

import {loadGrammarWithSemantics, runFromFile} from '../ohmLoader';

const {grammar, semantics} = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm');

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