import _ from 'lodash';

import {createSchema, createTable, createType} from '../../grammar/sql/postgreSQL.js';

export default function toPostgreSQL({model, orderedTables}) {
  const {schemas, schemaMap} = model;

  return _.concat(
           _.map(_.keys(schemaMap), createSchema), // Produce all schemas first
           _.flatMap(orderedTables, processTable)
         );

  function processTable(qualifiedTableName) {
    const [schemaName, tableName] = qualifiedTableName.split('.');

    const commands = [];

    const table = schemaMap[schemaName][tableName],
          columns = _.map(table.attributes, generateAttribute)
                     .concat(_.map(table.dependencies, generateDependency))
                     .join(', ');

    commands.push(createTable(`${schemaName}.${tableName}`, columns));

    return commands;

    function generateAttribute({name, optional, type}) {
      const parts = [name, type.length > 0 ? formatType(type[0]) : 'text'];

      if (optional.length === 0) parts.push('NOT NULL');

      return parts.join(' ');

      function formatType(type) {
        if (typeof type === 'string') return type;

        if (type.type === 'Set') {
          // These names are guaranteed to be unique, but maybe we want a way to de-duplicate equivalent types?
          commands.push(createType(`${schemaName}.${tableName}_${name}_enum`, type.values));

          return `${tableName}_${name}_enum NOT NULL DEFAULT '${type.values[0]}'`;
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