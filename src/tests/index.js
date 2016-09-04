// require('../traceur-runtime');

import fs from 'fs';
import util from 'util';

import _ from 'lodash';

import api from '../api';
import GrammarError from '../GrammarError';

const modelText = fs.readFileSync('./tests/samples/usda.sr28.model').toString();

try {
  log(api(modelText, 'postgresql', '^', '~').schema.join('\n'));
}
catch (e) {
  if (e instanceof GrammarError) {
    console.log(e.match.message);
  }
  else console.error(e);
}

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object': return util.inspect(arg, {showHidden: true, depth: null});
      default: return arg;
    }
  }
}