#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _orderTables = require('./transformers/orderTables');

var _orderTables2 = _interopRequireDefault(_orderTables);

var _toPostgreSQL2 = require('./transformers/postgreSQL/toPostgreSQL');

var _toPostgreSQL3 = _interopRequireDefault(_toPostgreSQL2);

var _ohmLoader = require('./ohmLoader');

var _RMOhm = require('./grammar/RM.ohm.js');

var _RMOhm2 = _interopRequireDefault(_RMOhm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./traceur-runtime');

var _loadGrammarWithSeman = (0, _ohmLoader.loadGrammarWithSemantics)('RM_PGSQL', ['toObject'], _RMOhm2.default);

var grammar = _loadGrammarWithSeman.grammar;
var semantics = _loadGrammarWithSeman.semantics;


var i = 2;
if (process.argv[0].endsWith('relational_modeler')) i = 1;

var fileName = process.argv[i],
    defaultName = fileName.split('.').slice(0, -1).join('.').split(/[\\/]/).pop(); //http://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript#comment29942319_15270931

var delimiter = process.argv[i + 1] || ',',
    quote = process.argv[i + 2] || '"';

var model = (0, _ohmLoader.runFromFile)(fileName, grammar, semantics, 'toObject');

var _toPostgreSQL = (0, _toPostgreSQL3.default)((0, _orderTables2.default)(model), delimiter, quote);

var schema = _toPostgreSQL.schema;
var imports = _toPostgreSQL.imports;


write(defaultName + '.sql', schema.join('\n') + '\n');
write(defaultName + '.import', imports.join('\n') + '\n');

function write(fileName, content) {
      console.log('writing', fileName);
      _fs2.default.writeFileSync(fileName, content);
}