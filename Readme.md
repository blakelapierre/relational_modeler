Try the web interface at: [https://blakelapierre.github.io/relational_modeler](https://blakelapierre.github.io/relational_modeler)

Sample Model:
````
database_name{
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
}
````

For the full grammar, please see [its definition](/src/grammar/RM.ohm.js).

````
 ! - Indicates the attribute is part of the table's primary key
 ? - Indicates the attribute may be NULL
-> - Indicates a foreign key attribute to the foreign table
````

###Installation
````
npm install -g relational_modeler
````

###Command-line Interface (CLI) Usage
````
relational_modeler sample.model
````

This will generate two files: 1) `sample.sql` and 2) `sample.import`.

`sample.sql` will contain a script that will create a database and schema for the model on a PostgreSQL database (other database engines can be easily added, but are not currently supported).

`sample.import` will contain a script that can be used to import data from character-separated-values (CSV) files. The characters used to delimit and quote values in the file may be passed as parameters.

All parameters:
````
relational_modeler [model file] [import file delimiter character] [import file quote character] [database engine]
````

###Web Interface Usage

The web interface is available at: [https://blakelapierre.github.io/relational_modeler](https://blakelapierre.github.io/relational_modeler)

The web interface can also be accessed by making the `.dist/web_interface` directory available to a web server and then accessing the index.html file.

Models can be typed or copy-pasted into the model text field and the corresponding SQL and import scripts may be copy-pasted out of the browser into any application you want.


###API Usage

````
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
````