import _ from 'lodash';

import {createSchema, createTable, createType} from './sql';

export default function toPostgreSQL({model, orderedTables}) {
  const {commonAttributes: modelAttributes, schemas} = model;

  const schemaMap = _.transform(schemas, (map, schema) => map[schema.name] = addTableMap(schema), {});

  model.schemaMap = schemaMap; // mutation of passed object!

  return createSchemas(schemas, schemaMap, orderedTables);

  function addTableMap(schema) {
    schema.tableMap = _.transform(schema.tables, (map, table) => map[table.name] = table, {});
    return schema;
  }

  function createSchemas(schemas, schemaMap, orderedTables) {
    return _.concat(
      _.map(_.keys(schemaMap), createSchema), // Produce all schemas first
      _.flatMap(orderedTables, processTable)
    );
  }

  function processTable(qualifiedTableName) {
    const [schemaName, tableName] = qualifiedTableName.split('.');

    const commands = [];

    const schema = schemaMap[schemaName],
          {commonAttributes: schemaAttributes} = schema,
          table = schema.tableMap[tableName],
          attributes = _.flatMap([modelAttributes, schemaAttributes, table.attributes]),
          columns = _.map(attributes, generateAttribute)
                     .concat(_.map(table.dependencies, generateDependency))
                     .join(', ');

    commands.push(createTable(`${schemaName}.${tableName}`, columns));

    return commands;

    function generateAttribute({name, primaryKey, optional, type}) {
      const parts = [name, type ? formatType(type) : 'text'];

      if (primaryKey && optional) throw new Error(`${schemaName}.${tableName}.${name} cannot be both a primary key and optional!`); // maybe outlaw this in the grammar?
      if (primaryKey) parts.push('PRIMARY KEY');
      else if (!optional) parts.push('NOT NULL');

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

          return `${newTypeName} NOT NULL DEFAULT '${type.values[0]}'`;
        }
        else throw new Error(`${type} not implemented!`);
      }
    }

    function generateDependency({preArity, postArity, reference: {schema, table}}) {
      const id = (schema === undefined ? '' : `${schema || schemaName}_`) + `${table}_id`,
            references = `${schema || schemaName}.${table}`;

      let type = 'bigint NOT NULL';

      if (postArity === 1) type += ' UNIQUE';

      return `${id} ${type} REFERENCES ${references}`;
    }
  }
}