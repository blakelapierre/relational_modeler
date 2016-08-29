#!/usr/bin/env node

// require('./traceur-runtime');

import fs from 'fs';
import util from 'util';

import orderTables from './transformers/orderTables';
import toPostgreSQL from './transformers/postgreSQL/toPostgreSQL';

import {loadGrammarWithSemantics, runFromFile} from './ohmLoader';

import rm_pgsql_grammar from './grammar/RM.ohm.js';

const engines = {
  'postgresql': {
    grammarName: 'RM_PGSQL',
    grammarText: rm_pgsql_grammar,
    generator: toPostgreSQL
  }
};

let i = 2;
if (process.argv[0].endsWith('relational_modeler')) i = 1;

const fileName = process.argv[i];

const delimiter = process.argv[i+1] || ',',
      quote = process.argv[i+2] || '"',
      engineName = process.argv[i+3] || 'postgresql';

processModelFile(fileName, engines[engineName]);

function processModelFile(fileName, {grammarName, grammarText, generator}) {
  const {grammar, semantics} = loadGrammarWithSemantics(grammarName, ['toObject'], grammarText);

  const model = runFromFile(fileName, grammar, semantics, 'toObject');

  const {schema, imports} = generator(orderTables(model), delimiter, quote);

  const defaultName = fileName.split('.').slice(0, -1).join('.').split(/[\\/]/).pop(); //http://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript#comment29942319_15270931

  write(`${defaultName}.sql`, schema.join('\n') + '\n');
  write(`${defaultName}.import`, imports.join('\n') + '\n');
}

function write(fileName, content) {
  console.log('writing', fileName);
  fs.writeFileSync(fileName, content);
}