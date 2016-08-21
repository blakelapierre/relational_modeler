#!/usr/bin/env node

require('./traceur-runtime');

import fs from 'fs';
import util from 'util';

import orderTables from './transformers/orderTables';
import toPostgreSQL from './transformers/postgreSQL/toPostgreSQL';

import {loadGrammarWithSemantics, runFromFile} from './ohmLoader';

const {grammar, semantics} = loadGrammarWithSemantics('RM_PGSQL', ['toObject'], './grammar/RM.ohm');

let i = 2;
if (process.argv[0].endsWith('relational_modeler')) i = 1;

const model = runFromFile('./tests/samples/usda.sr28.model', grammar, semantics, 'toObject');

const {schema, imports} = toPostgreSQL(orderTables(model));

const defaultName = process.argv[i].split('.')[0].split(/[\\/]/).pop(), //http://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript#comment29942319_15270931
      schemaFileName = process.argv[i+1] || (defaultName + '.sql'),
      importsFileName = process.argv[i+2] || (defaultName + '.import');

write(schemaFileName, schema.join('\n') + '\n');
write(importsFileName, imports.join('\n') + '\n');

function write(fileName, content) {
  console.log('writing', fileName);
  fs.writeFileSync(fileName, content);
}