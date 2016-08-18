Sample Model:
````
model_name {
  schema_name {
    table_name {
      !primaryKey
      attribute
    } -> foreign_table

    foreign_table {
      !primaryKey
      attribute?
    }
  }
}
````
For the full grammar, please see [its definition](/src/grammar/RM.ohm).

````
 ! - Indicates the attribute is part of the table's primary key
 ? - Indicates the attribute may be NULL
-> - Indicates a foreign key attribute to the foreign table
````