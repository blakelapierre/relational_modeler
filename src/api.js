import ohm from 'ohm-js';

import orderTables from './transformers/orderTables';
import toPostgreSQL from './transformers/postgreSQL/toPostgreSQL';

import rm_pgsql_grammar from './grammar/RM.ohm.js';
import rm_pgsql_toObject from './grammar/RM_PGSQL.toObject.semantics';

import GrammarError from './GrammarError';

const engines = {
  'postgresql': {
    config: {
      grammar: {
        name: 'RM_PGSQL',
        text: rm_pgsql_grammar
      },
      semantics: {
        'toObject': rm_pgsql_toObject
      },
    },
    generator: toPostgreSQL
  }
};

const api = (modelText, engine = 'postgresql', delimiter = ',', quote = '"', importMethod = 'psql') =>
  getReadyEngine(engine).generator(orderTables(generateModel(modelText, engine)), delimiter, quote, importMethod);

export {api, GrammarError};

function getReadyEngine(name) {
  const engine = engines[name];

  if (!engine) throw new Error(`No engine with name '${name}'!`);

  if (!engine.grammar) {
    const {grammar, semantics} = loadGrammarWithSemantics(engine);
    engine.grammar = grammar;
    engine.semantics = semantics;
  }

  return engine;
}

function loadGrammarWithSemantics(engine) {
  const {config} = engine;

  const grammar = ohm.grammars(config.grammar.text)[config.grammar.name],
        semantics = grammar.semantics();

  for (let name in config.semantics) semantics.addOperation(name, config.semantics[name]);

  return {grammar, semantics};
}

function generateModel(text, engineName) {
  const {grammar, semantics} = getReadyEngine(engineName);

  const match = grammar.match(text);

  if (match.succeeded()) return semantics(match).toObject();
  else throw new GrammarError(match);
}