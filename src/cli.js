#!/usr/bin/env node

import fs from 'fs';
import util from 'util';

import {api, GrammarError} from './api';

let i = 2;
if (process.argv[0].endsWith('relational_modeler')) i = 1;

const fileName = process.argv[i];

const delimiter = process.argv[i+1] || ',',
      quote = process.argv[i+2] || '"',
      engineName = process.argv[i+3] || 'postgresql',
      importMethod = process.argv[i+4] || 'psql';

processModelFile(fileName, engineName, delimiter, quote);

function processModelFile(fileName, engineName, delimiter, quote) {
  const modelText = fs.readFileSync(fileName).toString(),
        {schema, imports} = api(modelText, engineName, delimiter, quote, importMethod);

  const defaultName = fileName.split('.').slice(0, -1).join('.').split(/[\\/]/).pop(); //http://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript#comment29942319_15270931

  write(`${defaultName}.sql`, schema.join('\n') + '\n');
  write(`${defaultName}.import`, imports.join('\n') + '\n');
}

function write(fileName, content) {
  console.log('writing', fileName);
  fs.writeFileSync(fileName, content);
}