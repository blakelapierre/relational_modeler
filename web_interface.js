'use strict';

var _api2 = require('../api');

var delimiter = '^',
    quote = '~';
// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

document.addEventListener('DOMContentLoaded', function () {
  var modelArea = document.getElementsByTagName('modelarea')[0],
      modelAreaTextArea = modelArea.getElementsByTagName('textarea')[0],
      errorArea = modelArea.getElementsByTagName('errorarea')[0],
      resultArea = document.getElementsByTagName('resultarea')[0],
      sqlArea = document.getElementsByTagName('sqlarea')[0],
      sqlAreaSelect = sqlArea.getElementsByTagName('select')[0],
      sqlAreaTextArea = sqlArea.getElementsByTagName('textarea')[0],
      importArea = document.getElementsByTagName('importarea')[0],
      importAreaSelect = importArea.getElementsByTagName('select')[0],
      importAreaTextArea = importArea.getElementsByTagName('textarea')[0];

  var currentEngine = sqlAreaSelect.options[sqlAreaSelect.selectedIndex].value,
      importMethod = importAreaSelect.options[importAreaSelect.selectedIndex].value;

  modelAreaTextArea.addEventListener('keyup', function (_ref) {
    var target = _ref.target;
    return a(target.value);
  });

  sqlAreaSelect.addEventListener('change', function () {
    currentEngine = sqlAreaSelect.options[sqlAreaSelect.selectedIndex].value;
    a(modelAreaTextArea.value);
  });
  importArea.addEventListener('change', function () {
    importMethod = importAreaSelect.options[importAreaSelect.selectedIndex].value;
    a(modelAreaTextArea.value);
  });

  a(modelAreaTextArea.value);

  function a(value) {
    try {
      var _api = (0, _api2.api)(value, currentEngine, delimiter, quote, importMethod);

      var schema = _api.schema;
      var imports = _api.imports;


      sqlAreaTextArea.value = schema.join('\n') + '\n';
      importAreaTextArea.value = imports.join('\n') + '\n';
      errorArea.classList.remove('has-error');
    } catch (e) {
      console.log('error!', { e: e });
      if (e instanceof _api2.GrammarError) {
        var match = e.match;

        errorArea.classList.add('has-error');
        errorArea.innerHTML = match.message;
      } else if (e instanceof _api2.SemanticError) {
        errorArea.classList.add('has-error');
        errorArea.innerHTML = e.message;
      } else {
        errorArea.classList.add('has-error');
        errorArea.innerHTML = e.stack;
      }
    }
  }
});

function processModel(engine, model) {
  return (0, _api2.api)(model, currentEngine, delimiter, quote);
}
