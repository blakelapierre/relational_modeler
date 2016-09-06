import _ from 'lodash';
import tsort from 'tsort';

export default function orderTables(model) {
  const {schemas} = model;

  const orderedTables = _.reject(topologicalSort(_.flatMap(_.map(schemas, getSchemaLinks))).reverse(), v => v === '*'); // * represents a "null-link", it is not a real table; it is only used to include all tables (including those with no dependencies) in the array outputted by `topologicalSort`, without having to rewalk the model to determine which tables have no dependencies

  return {model, orderedTables};

  function topologicalSort(links) {
    return tsort(links).sort(); // Note: `tsort` only sets up the graph, must call `sort` to get the ordering. I had initially begun to implement my own topological sort, as `model` already contains a graph of the dependencies, but abandoned it due to finding this library function. If performance is ever a concern, there is a bit of optimization that can be done here.
  }

  function getSchemaLinks({name: schemaName, tables}) {
    return _.flatMap(_.map(tables, getTableLinks));

    function getTableLinks(table) {
      const {name, dependencies} = table,
            from = `${schemaName}.${name}`;

      if (dependencies.length === 0) return [[from, '*']];

      return _.map(dependencies,
        ({reference: {schema, table}}) => {
          const to = `${schema || schemaName}.${table}`;
          return from === to ? [from, '*'] : [from, to];
        });
    }
  }
}