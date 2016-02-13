"use strict";
var $__fs__,
    $__ohm_45_js__;
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var ohm = ($__ohm_45_js__ = require("ohm-js"), $__ohm_45_js__ && $__ohm_45_js__.__esModule && $__ohm_45_js__ || {default: $__ohm_45_js__}).default;
function loadGrammarWithSemantics(grammarName) {
  var semanticNames = arguments[1] !== (void 0) ? arguments[1] : [];
  var fileName = arguments[2] !== (void 0) ? arguments[2] : ("./grammar/" + grammarName + ".ohm");
  var grammar = ohm.grammars(fs.readFileSync(fileName))[grammarName],
      semantics = grammar.semantics();
  semanticNames.forEach(addSemanticName);
  return {
    grammar: grammar,
    semantics: semantics
  };
  function addSemanticName(name) {
    semantics.addOperation(name, require(("./grammar/" + grammarName + "." + name + ".semantics")).default);
  }
}
function run(modelFile, grammar, semantics, operation) {
  var match = grammar.match(fs.readFileSync(modelFile).toString());
  if (match.succeeded()) {
    var result = semantics(match).toObject();
    return result;
  } else {
    console.error(match.message);
  }
}
Object.defineProperties(module.exports, {
  loadGrammarWithSemantics: {get: function() {
      return loadGrammarWithSemantics;
    }},
  run: {get: function() {
      return run;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=ohmLoader.js.map
