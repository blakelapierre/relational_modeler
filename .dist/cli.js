#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _api2 = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i = 2;
if (process.argv[0].endsWith('relational_modeler')) i = 1;

var fileName = process.argv[i];

var delimiter = process.argv[i + 1] || ',',
    quote = process.argv[i + 2] || '"',
    engineName = process.argv[i + 3] || 'postgresql';

processModelFile(fileName, engineName, delimiter, quote);

function processModelFile(fileName, engineName, delimiter, quote) {
  var modelText = _fs2.default.readFileSync(fileName).toString();

  var _api = (0, _api2.api)(modelText, engineName, delimiter, quote);

  var schema = _api.schema;
  var imports = _api.imports;


  var defaultName = fileName.split('.').slice(0, -1).join('.').split(/[\\/]/).pop(); //http://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript#comment29942319_15270931

  write(defaultName + '.sql', schema.join('\n') + '\n');
  write(defaultName + '.import', imports.join('\n') + '\n');
}

function write(fileName, content) {
  console.log('writing', fileName);
  _fs2.default.writeFileSync(fileName, content);
}