'use strict';

var _api2 = require('../api');

var delimiter = '^',
    quote = '~';
// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

var samples = {
  'example': 'database_name {\n  schema_name {\n    table_name {\n      !primaryKey,\n      attribute\n    } -> foreign_table\n\n    foreign_table {\n      !primaryKey,\n      attribute? boolean\n    }\n  }\n}',
  'experiments': 'experiments { !id, inserted_at timestamp } {\n  binary {\n    coin_flip {\n      outcome { \'H\', \'T\' }\n    }\n  }\n}',
  'accounting': 'dist {!id, inserted_at timestamp} {\n  accounts {\n    account {key}\n    account_feature -> account -> features.feature\n  }\n\n  features {\n    feature {description} -> feature (parent_feature)\n    feature_cost {cost numeric} -> feature\n    feature_schedule {global_unlock_value numeric} -> feature\n    feature_progress {contributed_value numeric} -> feature\n  }\n\n  transactions {\n    transaction -> accounts.account\n    transaction_detail {amount numeric} -> transaction\n    transaction_account_feature -> accounts.account_feature -> transaction_detail\n  }\n}'
};

document.addEventListener('DOMContentLoaded', function () {
  var modelArea = document.getElementsByTagName('modelarea')[0],
      modelAreaSelect = modelArea.getElementsByTagName('select')[0],
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

  modelAreaSelect.selectedIndex = 0;
  modelAreaTextArea.value = samples[modelAreaSelect.options[modelAreaSelect.selectedIndex].value];

  modelAreaSelect.addEventListener('change', function () {
    modelAreaTextArea.value = samples[modelAreaSelect.options[modelAreaSelect.selectedIndex].value];
    a(modelAreaTextArea.value);
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
