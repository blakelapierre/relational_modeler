import api from 'relational_modeler';
import GrammarError from 'relational_modeler/GrammarError'; // Check this is right/valid

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