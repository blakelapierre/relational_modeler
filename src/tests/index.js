import fs from 'fs';
import util from 'util';

import ohm from 'ohm-js';

import toObject from '../grammar/RM.toObject.semantics';
// import toObject from '../RM.semantics.toObject';

console.log(toObject);
console.log(process.cwd());

const grammar = ohm.grammar(fs.readFileSync('./grammar/RM.ohm'));

const tpsql = grammar.semantics().addOperation('toObject', toObject);

const match = grammar.match(fs.readFileSync('./tests/samples/personal.model').toString());
if (match.succeeded()) {
  const result = tpsql(match).toObject();
  console.log(util.inspect(result, false, null));
}
else {
  console.error(match.message);
}
// grammar.semantics().addOperation('toObject', toObject);