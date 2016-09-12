
import _ from 'lodash';

import SemanticError from '../../SemanticError';

import {createDatabase, createSchema, createTable, createType} from './sql';

//Should be moved out somewhere else
const importMethods = {
  'psql': (delimiter, quote) =>
`#!/bin/bash

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_DATABASE=usda
ENCODING=SQL_ASCII

# if nc -h; then
#      until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
#           echo "$(date) - waiting on postgre..."
#           sleep 1
#      done
# fi

copy() {
     COMMAND="SET client_encoding = '$\{ENCODING\}'; BEGIN; COPY $\{1\} FROM STDIN WITH CSV DELIMITER '${delimiter}' QUOTE '${quote}' ENCODING '$\{ENCODING\}' NULL ''; COMMIT;"

     echo "running $COMMAND"

     psql -h "$POSTGRES_HOST" \\
          -p "$POSTGRES_PORT" \\
          -d "$POSGRES_DATABASE" \\
          -v ON_ERROR_STOP=1 \\
          -U "$POSTGRES_USER" \\
          -x \\
          -c "$COMMAND" \\
          < $2
}`,
  'docker': (delimiter, quote) =>
`#!/bin/bash

POSTGRES_HOST=postgres-usda
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_DATABASE=usda
ENCODING=SQL_ASCII

# if nc -h; then
#      until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
#           echo "$(date) - waiting on postgre..."
#           sleep 1
#      done
# fi

copy() {
     COMMAND="SET client_encoding = '$\{ENCODING\}'; BEGIN; COPY $\{1\} FROM STDIN WITH CSV DELIMITER '${delimiter}' QUOTE '${quote}' ENCODING '$\{ENCODING\}' NULL ''; COMMIT;"

     echo "running $COMMAND"

     docker run --rm -it \\
                --link postgres-usda \\
               -v $(pwd)/data:/data:z \\
               postgres /bin/bash -c "psql -h postgres-usda -p 5432 -U postgres -d usda -v ON_ERROR_STOP=1 -c \\"$COMMAND\\"  < \\"/data/$\{2\}\\""
}
`
};

export default function toPostgreSQL({model, orderedTables}, delimiter = ',', quote = '"', importMethod = 'psql') {
  model = new Model(model);
  const {commonAttributes: modelAttributes, schemas} = model;

  const schemaMap = _.transform(schemas, (map, schema) => map[schema.name] = addTableMap(schema), {});

  model.schemaMap = schemaMap; // mutation of passed object!

  resolveDependencies(schemas, schemaMap, orderedTables);

  return {
    schema: [createDatabase(model.name)].concat(createSchemas(schemas, schemaMap, orderedTables)),
    imports: createImports(orderedTables, importMethod)
  };

  function addTableMap(schema) {
    schema.tableMap = _.transform(schema.tables, (map, table) => map[table.name] = table, {});
    return schema;
  }

  // This should be broken out into a separate model (module?), but we want the schema map and that is here!
  function resolveDependencies(schemas, schemaMap, orderedTables) {
    schemas.forEach(({name, tables}) =>
      tables.forEach(({name: tableName, dependencies}) =>
        dependencies.forEach(({reference}) =>
          reference.attribute = getTable(schemaMap, reference.schema || name, reference.table).primaryKeys[0])));
  }

  function getTable(schemaMap, schemaName, tableName) {
    const table = getSchema(schemaMap, schemaName).tableMap[tableName];

    if (!table) throw new SemanticError(`No Table "${schemaName}"."${tableName}"!`);

    return table;
  }

  function getSchema(schemaMap, schemaName) {
    const schema = schemaMap[schemaName];

    if (!schema) throw new SemanticError(`No Schema "${schemaName}"!`);

    return schema;
  }

  function createSchemas(schemas, schemaMap, orderedTables) {
    return _.concat(
      _.map(_.keys(schemaMap), createSchema), // Produce all schemas first
      _.flatMap(orderedTables, processTable)
    );
  }

  function createImports(orderedTables, importMethod, extension = '.txt') {
    return [importMethods[importMethod](delimiter, quote)].concat(orderedTables.map(qualifiedTableName => copy(tableName(qualifiedTableName), fileName(qualifiedTableName))));

    function copy(table, file) {
      return `copy '${table}' "${file}"`;
    }

    function tableName(qualifiedTableName) {
      // should support something like: (${columnList}) so that imports can more easily be customized to the column order of the data file
      const [schema, table] = qualifiedTableName.split('.');
      return `\\"${schema}\\".\\"${table}\\"`;
    }

    function fileName(name) {
      let [schemaName, tableName] = name.split('.');

      return `${schemaName}/${tableName}${extension}`;
    }
  }

  function processTable(qualifiedTableName) {
    const [schemaName, tableName] = qualifiedTableName.split('.');

    const commands = [];

    const schema = schemaMap[schemaName],
          {commonAttributes: schemaAttributes} = schema,
          table = schema.tableMap[tableName],
          attributes = _.flatMap([modelAttributes, schemaAttributes, table.attributes || []]),
          primaryKeys = table.primaryKeys,
          unique = table.unique,
          columns = _.map(attributes, generateAttribute)
                     .concat(_.map(table.dependencies, generateDependency))
                     .join(', ');

    const constraints = [];

    if (primaryKeys.length > 0) constraints.push(`PRIMARY KEY (${primaryKeys.map(({name}) => `"${name}"`)})`);
    if (unique.length > 0) constraints.push(`UNIQUE (${unique.map(({name}) => `"${name}"`)})`);

    commands.push(createTable(`"${schemaName}"."${tableName}"`, columns, constraints));

    return commands;

    function generateAttribute({name, primaryKey, optional, type, check}) {
      const parts = [`"${name}"`, type ? formatType(type) : 'text'];

      if (primaryKey && optional) throw new Error(`"${schemaName}"."${tableName}"."${name}" cannot be both a primary key and optional!`); // maybe outlaw this in the grammar?

      if (!primaryKey && !optional) parts.push('NOT NULL');

      if (check) {
        const {operator, value} = check;

        if (value.check === 'Number') parts.push(`CHECK (${name} ${operator} ${value.number})`);
        else if (value.check === 'Name') {
          if (!_.some(attributes, attribute => attribute.name === value.name)) throw new SemanticError(`Cannot check against "${value.name}", it is not an attribute of "${table.name}"!`); // should also type-check here
          parts.push(`CHECK ("${name}" ${operator} "${value.name}")`);
        }
        else throw new Error('!', value);
      }

      return parts.join(' ');

      function formatType(type) {
        if (typeof type === 'string') {
          if (type === 'timestamp') return `${type} DEFAULT now()`;
          return type;
        }

        if (type.type === 'Set') {
          // These names are guaranteed to be unique, but maybe we want a way to de-duplicate equivalent types?
          const newTypeName = `"${schemaName}"."${tableName}_${name}_enum"`;
          commands.push(createType(`${newTypeName}`, type.values));

          return `${newTypeName} DEFAULT '${type.values[0]}'`;
        }
        else if (type.type === 'Numeric') {
          const parameters = [];
          if (type.precision !== undefined) parameters.push(type.precision);
          if (type.scale !== undefined) parameters.push(type.scale);

          if (parameters.length > 0) return `NUMERIC(${parameters.join(',')})`;
          return `NUMERIC`;
        }
        else if (type.type === 'Blob') {
          return `BYTEA`;
        }
        else if (type.type === 'VarChar') {
          if (type.length !== undefined) return `VARCHAR(${type.length})`;
          return `VARCHAR`;
        }
        else throw new Error(`${type.type} not implemented!`);
      }
    }

    function generateDependency({name, preArity, postArity, reference: {schema, table, attribute}, optional}) {
      const id = name ||
                 ((schema === undefined ? '' : `${schema || schemaName}_`) + `${table}_${(attribute || {name: 'id'}).name}`),
            references = `"${schema || schemaName}"."${table}"`;

      let type = (attribute || {type: 'bigint'}).type;

      if (typeof type !== 'string') type = type.type;
      if (!optional) type = `${type} NOT NULL`;

      if (preArity === 1 && postArity === 1) type += ' UNIQUE';

      return `"${id}" ${type} REFERENCES ${references}`;
    }
  }
}

// get primaryKeys() { return _.filter(attributes, a => a.primaryKey); }

class Model {
  constructor ({commonAttributes, name, schemas}) {
    this.commonAttributes = commonAttributes;
    this.name = name;
    this.schemas = _.map(schemas, schema => new Schema(this, schema));
  }
}

class Schema {
  constructor (model, {name, commonAttributes, tables}) {
    this.model = model;
    this.name = name;
    this.commonAttributes = commonAttributes;
    this.tables = _.map(tables, table => new Table(this, table));
  }
}

class Table {
  constructor (schema, {name, attributes, dependencies}) {
    this.schema = schema;
    this.name = name;
    this.attributes = attributes;
    this.dependencies = dependencies;
  }

  get model() { return schema.model; }

  get primaryKeys() {
    // console.log({this});
    const {schema, attributes: tableAttributes, dependencies} = this,
          {commonAttributes: schemaAttributes, model} = schema,
          {commonAttributes: modelAttributes, schemaMap} = model;

    return _.concat(
      _.filter(modelAttributes, a => a.primaryKey),
      _.filter(schemaAttributes, a => a.primaryKey),
      _.filter(tableAttributes, a => a.primaryKey),
      _.map(
        _.filter(dependencies, d => d.primaryKey),
          ({name, reference: {schema: schemaName, table: tableName}}) => //console.log(schemaMap[schemaName || schema.name].tableMap[tableName]) &
          ({
            name: name ||
                  ((schemaName === undefined ? '' : `${schemaName || schema.name}_`) +
                  `${tableName}_${((schemaMap[schemaName || schema.name].tableMap[tableName].primaryKeys[0]) || {name: 'id'}).name}`)
          })));
  }

  get unique() {
    const {schema, attributes: tableAttributes, dependencies} = this,
          {commonAttributes: schemaAttributes, model} = schema,
          {commonAttributes: modelAttributes, schemaMap} = model;

    return _.concat(
      _.filter(modelAttributes, a => a.unique),
      _.filter(schemaAttributes, a => a.unique),
      _.filter(tableAttributes, a => a.unique),
      _.map(
        _.filter(dependencies, d => d.unique),
          ({name, reference: {schema: schemaName, table: tableName}}) => //console.log(schemaMap[schemaName || schema.name].tableMap[tableName]) &
          ({
            name: name ||
                  ((schemaName === undefined ? '' : `${schemaName || schema.name}_`) +
                  `${tableName}_${((schemaMap[schemaName || schema.name].tableMap[tableName].primaryKeys[0]) || {name: 'id'}).name}`)
          })));
  }
}