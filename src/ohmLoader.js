import fs from 'fs';
import ohm from 'ohm-js';

export function loadGrammarWithSemantics(grammarName, semanticNames = [], fileName = `./grammar/${grammarName}.ohm`) {
  const grammar = ohm.grammars(fs.readFileSync(fileName))[grammarName],
        semantics = grammar.semantics();

  semanticNames.forEach(addSemanticName);

  return {grammar, semantics};

  function addSemanticName(name) {
    const s = require(`./grammar/${grammarName}.${name}.semantics`).default;
    semantics.addOperation(name, s);
  }
}

export function run(model, grammar, semantics, operation) {
  const match = grammar.match(model);
  if (match.succeeded()) {
    const result = semantics(match).toObject();
    return result;
  }
  else {
    console.error(match.message);
  }
}

export function runFromFile(modelFile, grammar, semantics, operation) {
  return run(fs.readFileSync(modelFile).toString(), grammar, semantics, operation);
}