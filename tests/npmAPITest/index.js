import {api, GrammarError} from 'relational_modeler';

const modelText =
`database_name{
  schema_name {
    table_name {
      !primaryKey,
      attribute
    } -> foreign_table

    foreign_table {
      !primaryKey,
      attribute? boolean
    }
  }
}`;

try {
  console.log(api(modelText, 'postgresql', '^', '~').schema.join('\n'));
}
catch (e) {
  if (e instanceof GrammarError) {
    console.log(e.match.message);
  }
  else console.log(e);
}