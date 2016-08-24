import _ from 'lodash';

import {createDatabase, createSchema, createTable, createType} from './sql';

export default function toPostgreSQL({model, orderedTables}, delimiter = ',', quote = '"') {
  const {commonAttributes: modelAttributes, schemas} = model;

  const schemaMap = _.transform(schemas, (map, schema) => map[schema.name] = addTableMap(schema), {});

  model.schemaMap = schemaMap; // mutation of passed object!

  resolveDependencies(schemas, schemaMap);

  return {
    schema: [createDatabase(model.name)].concat(createSchemas(schemas, schemaMap, orderedTables)),
    imports: createImports(orderedTables)
  };

  function addTableMap(schema) {
    schema.tableMap = _.transform(schema.tables, (map, table) => map[table.name] = table, {});
    return schema;
  }

  // This should be broken out into a separate model, but we want the schema map and that is here!
  function resolveDependencies(schemas, schemaMap) {
    schemas.forEach(({tables}) => tables.forEach(table => table.primaryKeys = _.filter(table.attributes, a => a.primaryKey)));
    schemas.forEach(({name, tables}) => {
      return tables.forEach(table => {
        const {name: tableName, dependencies} = table;
        return dependencies.forEach(({reference}) => {
          reference.attribute = schemaMap[reference.schema || name].tableMap[reference.table].primaryKeys[0];
        });
      });
    });
  }

  function createSchemas(schemas, schemaMap, orderedTables) {
    return _.concat(
      _.map(_.keys(schemaMap), createSchema), // Produce all schemas first
      _.flatMap(orderedTables, processTable)
    );
  }

  function createImports(orderedTables, extension = '.txt') {
    return orderedTables.map(qualifiedTableName => run(copy(qualifiedTableName), fileName(qualifiedTableName)));

    function run(command, file) {
      return `run "${command}" "${file}"`;
    }

    function copy(qualifiedTableName) {
      return `BEGIN; COPY ${qualifiedTableName} FROM STDIN WITH CSV DELIMITER '${delimiter}' QUOTE '${quote}'; COMMIT;`;
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
          attributes = _.flatMap([modelAttributes, schemaAttributes, table.attributes]),
          primaryKeys = table.primaryKeys,
          columns = _.map(attributes, generateAttribute)
                     .concat(_.map(table.dependencies, generateDependency))
                     .join(', ');

    const constraints = [];

    if (primaryKeys.length > 0) constraints.push(`PRIMARY KEY (${primaryKeys.map(a => a.name)})`);

    commands.push(createTable(`${schemaName}.${tableName}`, columns, constraints));

    return commands;

    function generateAttribute({name, primaryKey, optional, type}) {
      const parts = [name, type ? formatType(type) : 'text'];

      if (primaryKey && optional) throw new Error(`${schemaName}.${tableName}.${name} cannot be both a primary key and optional!`); // maybe outlaw this in the grammar?

      if (!primaryKey && !optional) parts.push('NOT NULL');

      return parts.join(' ');

      function formatType(type) {
        if (typeof type === 'string') {
          if (type === 'timestamp') return `${type} DEFAULT now()`;
          return type;
        }

        if (type.type === 'Set') {
          // These names are guaranteed to be unique, but maybe we want a way to de-duplicate equivalent types?
          const newTypeName = `${tableName}_${name}_enum`;
          commands.push(createType(`${schemaName}.${newTypeName}`, type.values));

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

    function generateDependency({preArity, postArity, reference: {schema, table, attribute}}) {
      const id = (schema === undefined ? '' : `${schema || schemaName}_`) + `${table}_${(attribute || {name: 'id'}).name}`,
            references = `${schema || schemaName}.${table}`;

      let type = (attribute || {type: 'bigint'}).type;

      if (typeof type !== 'string') type = type.type;
      type = `${type} NOT NULL`;

      if (preArity === 1 && postArity === 1) type += ' UNIQUE';

      return `${id} ${type} REFERENCES ${references}`;
    }
  }
}

// get primaryKeys() { return _.filter(attributes, a => a.primaryKey); }