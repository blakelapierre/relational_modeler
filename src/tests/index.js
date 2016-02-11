require('../traceur-runtime');

import fs from 'fs';
import util from 'util';

import ohm from 'ohm-js';
import _ from 'lodash';
import tsort from 'tsort';

const {grammar, semantics} = loadGrammarWithSemantics('RM_SQL', ['toObject'], './grammar/RM.ohm');

const result = run('./tests/samples/personal.model', grammar, semantics, 'toObject');

log(util.inspect(result, false, null));

log(toPostgreSQL(orderDependencies(result)).join('\n'));

function loadGrammarWithSemantics(grammarName, semanticNames = [], fileName = `./grammar/${grammarName}.ohm`) {
  const grammar = ohm.grammars(fs.readFileSync(fileName))[grammarName],
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
  const {schemas, schemaMap} = model;

  const createdSchema = _.mapValues(schemaMap, _ => false);

  console.log({createdSchema});

  return _.flatMap(orderedDependencies, emitDependency);

  function emitDependency(dependency) {
    const [schemaName, tableName] = dependency.split('.');

    const commands = [];
    if (!createdSchema[schemaName]) {
      commands.push(`CREATE SCHEMA ${schemaName};`);
      createdSchema[schemaName] = true;
    }

    const table = schemaMap[schemaName][tableName],
          columns = _.map(table.attributes, generateAttribute)
                     .concat(_.map(table.dependencies, generateDependency))
                     .join(', ');

    commands.push(`CREATE TABLE ${schemaName}.${tableName} (${columns});`);

    return commands;

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

function orderDependencies(model) {
  const {schemas} = model;
  const ordered = [];
  const schemaMap = {};

  model.schemaMap = schemaMap;

  const orderedDependencies = _.reject(topologicalSort(_.flatMap(_.map(schemas, analyzeSchema))).reverse(), v => v === '*');
  console.log({orderedDependencies});

  return {model, orderedDependencies};

  function topologicalSort(links) {
    return tsort(links).sort(); // Note: `tsort` only sets up the graph, must call `sort` to get the ordering. I had initially begun to implement my own topological sort, as `model` already contains a graph of the dependencies, but abandoned it due to finding this library function. If performance is ever a concern, there is a bit of optimization that can be done here.
  }

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