'use strict';

var _api2 = require('../api');

var _api3 = _interopRequireDefault(_api2);

var _GrammarError = require('../GrammarError');

var _GrammarError2 = _interopRequireDefault(_GrammarError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

var delimiter = '^',
    quote = '~';

var currentEngine = 'postgresql';

document.addEventListener('DOMContentLoaded', function () {
  var modelArea = document.getElementsByTagName('modelarea')[0],
      modelAreaTextArea = modelArea.getElementsByTagName('textarea')[0],
      errorArea = modelArea.getElementsByTagName('errorarea')[0],
      resultArea = document.getElementsByTagName('resultarea')[0],
      sqlArea = document.getElementsByTagName('sqlarea')[0],
      sqlAreaTextArea = sqlArea.getElementsByTagName('textarea')[0],
      importArea = document.getElementsByTagName('importarea')[0],
      importAreaTextArea = importArea.getElementsByTagName('textarea')[0];

  modelAreaTextArea.addEventListener('keyup', function (_ref) {
    var target = _ref.target;
    return a(target.value);
  });

  a(modelAreaTextArea.value);

  function a(value) {
    try {
      var _api = (0, _api3.default)(value, currentEngine, delimiter, quote);

      var schema = _api.schema;
      var imports = _api.imports;


      sqlAreaTextArea.value = schema.join('\n') + '\n';
      importAreaTextArea.value = imports.join('\n') + '\n';
      errorArea.classList.remove('has-error');
    } catch (e) {
      console.log('error!', e);
      if (e instanceof _GrammarError2.default) {
        var match = e.match;

        errorArea.classList.add('has-error');
        errorArea.innerHTML = match.message;
      } else {
        errorArea.classList.add('has-error');
        errorArea.innerHTML = e.message;
      }
    }
  }
});

function processModel(engine, model) {
  return (0, _api3.default)(model, currentEngine, delimiter, quote);
}
