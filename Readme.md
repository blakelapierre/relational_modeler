Try the web interface at: [https://blakelapierre.github.io/relational_modeler](https://blakelapierre.github.io/relational_modeler)

Sample Models:
````
database_name{
  schema_name {
    table_name {
      @primaryKey,
      attribute
    } -> foreign_table

    foreign_table {
      @primaryKey,
      attribute? boolean
    }
  }
}

experiments { @id, inserted_at timestamp } {
  binary {
    coin_flip {
      outcome { 'H', 'T' }
    }
  }

  cats_on_pants {
    cat { name }
    cat_position { position { 'pants1', 'pants2', 'both', 'neither' } } -> cat
  }
}

dist  {
  accounts {
    accounts {key}
  }

  features {
    features {description}
    accounts_features -> accounts.accounts -> features
  }

  billing {
    transaction {amount numeric} -> features.accounts_features
  }
}

dist {@id, inserted_at timestamp} {
  accounts {
    account {key}
  }

  features {
    feature {description, unlocked boolean} -> feature (parent_feature)
    account_feature -> accounts.account -> feature
    feature_cost {cost numeric > 0} -> feature
    feature_schedule {global_unlock_value numeric} -> feature
    feature_progress {contributed_value numeric} -> feature
  }

  transactions {
    transaction -> accounts.account
    transaction_detail {amount numeric} -> transaction
    transaction_account_feature -> features.account_feature -> transaction_detail
  }
}

dist {@id, inserted_at timestamp} {
  accounts {
    account {key}
    account_feature -> account -> features.feature
  }

  features {
    feature {description} -> feature (parent_feature)
    feature_cost {cost numeric} -> !feature
    feature_schedule {global_unlock_value numeric} -> !feature
    feature_progress {contributed_value numeric} -> !feature

    // NOTE: this syntax is not currently available
    feature_unlocked : feature_progress.contributed_value >= feature_schedule.global_unlock_value
  }

  transactions {
    transaction -> accounts.account
    transaction_detail {amount numeric} -> transaction
    transaction_account_feature -> accounts.account_feature -> transaction_detail
  }
}
````

For the full grammar, please see [its definition](/src/grammar/RM.ohm.js).

````
 @ - Indicates the attribute is part of the table's PRIMARY KEY
 ! - Indicates the attribute is part of a UNIQUE constraint
 ? - Indicates the attribute may be NULL
-> - Indicates a foreign key attribute REFERENCES the primary key of another table
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