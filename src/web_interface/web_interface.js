
// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

import orderTables from './transformers/orderTables';
import toPostgreSQL from './transformers/postgreSQL/toPostgreSQL';

import ohm from 'ohm-js';

document.addEventListener('DOMContentLoaded', () => {
  const modelArea = document.getElementsByTagName('modelarea')[0],
        modelAreaTextArea = modelArea.getElementsByTagName('textarea')[0];

  modelAreaTextArea.addEventListener('change', (first, second, third) => console.log(first, second, third));
});

function loadGrammarWithSemantics(grammarName, semanticNames = [], grammarText = '') {
  const grammar = ohm.grammars(grammarText)[grammarName],
        semantics = grammar.semantics();

  semanticNames.forEach(addSemanticName);

  return { grammar, semantics };

  function addSemanticName(name) {
    const s = require(`./grammar/${ grammarName }.${ name }.semantics`).default;
    semantics.addOperation(name, s);
  }
}
