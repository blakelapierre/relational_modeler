import fs from 'fs';
import util from 'util';

import ohm from 'ohm-js';

import toJSON from '../grammar/RM.toJSON.semantics';
// import toJSON from '../RM.semantics.toJSON';

console.log(toJSON);
console.log(process.cwd());

const grammar = ohm.grammar(fs.readFileSync('./grammar/RM.ohm'));

const tpsql = grammar.semantics().addOperation('toJSON', toJSON);

const match = grammar.match(fs.readFileSync('./tests/samples/personal.model').toString());
if (match.succeeded()) {
  const result = tpsql(match).toJSON();
  console.log(util.inspect(result, false, null));
}
else {
  console.error(match.message);
}
// grammar.semantics().addOperation('toJSON', toJSON);