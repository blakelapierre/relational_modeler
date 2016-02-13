require('../traceur-runtime');

import fs from 'fs';
import util from 'util';

import ohm from 'ohm-js';
import _ from 'lodash';
import tsort from 'tsort';

import {createSchema, createTable, createType} from '../grammar/sql/postgreSQL.js';

const {grammar, semantics} = loadGrammarWithSemantics('RM_SQL', ['toObject'], './grammar/RM.ohm');

const result = run('./tests/samples/personal.model', grammar, semantics, 'toObject');

log(util.inspect(result, false, null));

log(toPostgreSQL(orderTables(result)).join('\n'));

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

function toPostgreSQL({model, orderedTables}) {
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
      console.log(schemaName, schema, table);
      const id = (schema === undefined ? '' : `${schema || schemaName}_`) + `${table}_id`,
            references = `${schema || schemaName}.${table}`;

      let type = 'bigint NOT NULL';

      if (postArity === 1) type += ' UNIQUE';

      return `${id} ${type} REFERENCES ${references}`;
    }
  }
}

function orderTables(model) {
  const {schemas} = model;
  const ordered = [];
  const schemaMap = {};

  model.schemaMap = schemaMap;

  const orderedTables = _.reject(topologicalSort(_.flatMap(_.map(schemas, analyzeSchema))).reverse(), v => v === '*');
  console.log({orderedTables});

  return {model, orderedTables};

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