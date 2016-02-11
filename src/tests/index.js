require('../traceur-runtime');

import fs from 'fs';
import util from 'util';

import ohm from 'ohm-js';
import _ from 'lodash';
import tsort from 'tsort';

const {grammar, semantics} = loadGrammarWithSemantics('RM', ['toObject']);

const result = run('./tests/samples/personal.model', grammar, semantics, 'toObject');

log(util.inspect(result, false, null));

log(toPostgreSQL(orderDependencies(result)).join(''));

function loadGrammarWithSemantics(grammarName, semanticNames = []) {
  const grammar = ohm.grammar(fs.readFileSync(`./grammar/${grammarName}.ohm`)),
        semantics = grammar.semantics();

  semanticNames.forEach(addSemanticName);

  return {grammar, semantics};

  function addSemanticName(name) {
    semantics.addOperation(name, require(`../grammar/${grammarName}.${name}.semantics`).default);
  }
}

function run(modelFile, grammar, semantics, operation) {
  const match = grammar.match(fs.readFileSync(modelFile).toString());
  if (match.succeeded()) {
    const result = semantics(match).toObject();
    return result;
  }
  else {
    console.error(match.message);
  }
}

function toPostgreSQL({model, orderedDependencies}) {
  console.log(model);
  return _.flatMap(model.schemas, generateSchema);

  function generateSchema(schema) {
    console.log(schema);
    return _.concat([`CREATE SCHEMA ${schema.name};\n`],
                   _.map(schema.tables, generateTable));

    function generateTable (table) {
      const name = `${schema.name}.${table.name}`,
            columns = _.map(table.attributes, generateAttribute)
                       .concat(_.map(table.dependencies, generateDependency))
                       .join(', ');

      return `CREATE TABLE ${name} (${columns});\n`;

      function generateAttribute({name, type}) {
        return `${name} ${type.length > 0 ? type : 'text'}`;
      }

      function generateDependency({preArity, postArity, reference: {schema, table}}) {
        const id = (schema === table ? '' : `${schema}.`) + `${table}_id`,
              references = `${schema}.${table}`;

        let type = 'bigint NOT NULL';

        if (postArity === 1) type += ' UNIQUE';

        return `${id} ${type} REFERENCES ${references}`;
      }
    }
  }
}

// function * generateSchema(name, objects) {
//   yield `CREATE SCHEMA ${name};`;

//   yield* generateObjects(objects);

//   function * generateObjects(objects) {

//   }
// }

function orderDependencies(model) {
  const {schemas} = model;
  const ordered = [];
  const schemaMap = {};

  model.schemaMap = schemaMap;

  const orderedDependencies = tsort(_.flatMap(_.map(schemas, analyzeSchema))).sort().reverse();
  console.log({orderedDependencies});

  return {model, orderedDependencies};

  function analyzeSchema({name, tables}) {
    let schemaName = name;
    schemaMap[schemaName] = {};
    return _.flatMap(_.map(tables, gTables));

    function gTables(table) {
      const {name, dependencies} = table;
      schemaMap[schemaName][name] = table;
      if (dependencies.length === 0) return [[`${schemaName}.${name}`, `*`]];
      return _.map(dependencies, ({reference: {schema, table}}) => [`${schemaName}.${name}`, `${schema || schemaName}.${table}`]);
    }
  }
  // const schemas = [],
  //       orderedSchema = {};

  // const {dependentsMap, roots} = createDependentsMap(model.schemas);

  // log({dependentsMap});

  // for (let i = 0; i < roots.length; i++) {
  //   const {schema, table} = roots[i];
  //   log('root', i, schema.name, table.name);
  //   const dependents = (dependentsMap[schema.name] || {})[table.name] || [];
  //   log(({dependents}));
  //   if (dependents) dependents.forEach(createDependentHandler(dependentsMap, roots));
  // }

  // log('roots', roots);
  // // log('groupedroots', _(roots).groupBy(root => root.schema.name));

  // schemas.splice(0, roots.length, ...roots);

  // return {name: model.name, schemas: model.schemas};

  // function createDependentHandler (dependentsMap, roots) {
  //   return dependent => {
  //     log('->', dependent.schema.name, dependent.table.name);

  //     const map = dependentsMap[dependent.schema.name];

  //     if (map && map[dependent.table.name]) delete map[dependent.table.name];

  //     dependent.table.dependencies.forEach(dependency => {
  //       log('d', dependency);
  //     });


  //     roots.push(dependent);
  //   };
  // }

  // function createDependentsMap(schemas) {
  //   const dependentsMap = {},
  //         schemaMap = {},
  //         roots = [];

  //   schemas.forEach(schema => schemaMap[schema.name]);
  //   schemas.forEach(handleSchema);

  //   return {dependentsMap, roots};

  //   function handleSchema(schema) {
  //     const {name, tables} = schema,
  //           map = (dependentsMap[name] = dependentsMap[name] || {});

  //     console.log('!!', name);

  //     tables.forEach(handleTable);

  //     function handleTable(table) {
  //       const {attributes, dependencies} = table;

  //       if (dependencies.length === 0) roots.push({schema, table});

  //       const dependent = {attribute: 'id', schema, table};

  //       dependencies.forEach(createDependenciesHandler(dependent));
  //     }

  //     function createDependenciesHandler(dependent) {
  //       return dependency => {
  //         console.log('dependency', dependency);
  //         const {schema, table} = dependency;

  //         dependency.reference.schema = dependency.reference.schema || name;
  //         addDependent(dependency.reference.schema, table, dependent);
  //       };
  //     }
  //   }

  //   function addDependent(schema, table, dependent) {
  //     console.log('ad', schema, table);
  //     const map = (dependentsMap[schema] = dependentsMap[schema] || {});

  //     (map[table] = map[table] || []).push(dependent);
  //   }
  // }

  // schemas.forEach(schema => {
  //   const {name, tables} = schema;

  //   const tableMap = createTableMap(tables),
  //         {ordered, dependencyMap} = createDependencyMap(schema, tableMap);

  //   log(name, 'tableMap', tableMap);
  //   log(name, 'dependencyMap', util.inspect(dependencyMap, {showHidden: true, depth: 1}));
  //   log(name, 'ordered', util.inspect(ordered, {showHidden: true, depth: null}));

  //   for (let i = 0; i < ordered.length; i++) {
  //     log(name, 'ordered', i, ordered[i]);
  //     const dependents = dependencyMap[ordered[i].name];
  //     log(({dependents}));
  //     if (dependents) dependents.forEach(createDependentHandler(dependencyMap, ordered));
  //   }

  //   orderedSchema[name] = ordered;


  //   function createDependencyMap(schema, tableMap) {
  //     const dependencyMap = {};

  //     const externalSchemaDependencies = {},
  //           ordered = [];

  //     tables.forEach(table => {
  //       const {name: tableName, attributes, dependencies} = table;

  //       if (dependencies.length === 0) ordered.push(table);

  //       const dependency = {attribute: 'id', schema, table};

  //       dependencies.forEach(({schema, table}) => {
  //         log({schema, table});
  //         if (schema !== undefined) (externalSchemaDependencies[schema] = externalSchemaDependencies[schema] || []).push(dependency);
  //         (dependencyMap[table] = dependencyMap[table] || []).push(dependency);
  //       });
  //     });

  //     console.log('ordered', util.inspect(ordered, null, 2));

  //     return {ordered, dependencyMap};
  //   }

  //   function createTableMap(tables) {
  //     const tableMap = {};
  //     tables.forEach(table => {
  //       if (tableMap[table.name]) throw new Error(`Duplicate table name (${table.name})!`);
  //       tableMap[table.name] = table;
  //     });
  //     return tableMap;
  //   }

  //   function createDependentHandler (dependencyMap, tableMap) {
  //     return dependency => {
  //       log('->', dependency);
  //       ordered.push(dependency);
  //     };
  //   }
  // });



  // return {name, orderedSchemas};
}

function log(...args) {
  console.log.apply(console, args.map(transformArg));

  function transformArg(arg) {
    switch (typeof arg) {
      case 'object': return util.inspect(arg, {showHidden: true, depth: null});
      default: return arg;
    }
  }
}