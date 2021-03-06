'use strict';

var _relational_modeler = require('relational_modeler');

var modelText = 'database_name{\n  schema_name {\n    table_name {\n      !primaryKey,\n      attribute\n    } -> foreign_table\n\n    foreign_table {\n      !primaryKey,\n      attribute? boolean\n    }\n  }\n}';

try {
  console.log((0, _relational_modeler.api)(modelText, 'postgresql', '^', '~').schema.join('\n'));
} catch (e) {
  if (e instanceof _relational_modeler.GrammarError) {
    console.log(e.match.message);
  } else console.log(e);
}