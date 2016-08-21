'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = orderTables;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tsort = require('tsort');

var _tsort2 = _interopRequireDefault(_tsort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function orderTables(model) {
  var schemas = model.schemas;


  var orderedTables = _lodash2.default.reject(topologicalSort(_lodash2.default.flatMap(_lodash2.default.map(schemas, getSchemaLinks))).reverse(), function (v) {
    return v === '*';
  }); // * represents a "null-link", it is not a real table; it is only used to include all tables (including those with no dependencies) in the array outputted by `topologicalSort`, without having to rewalk the model to determine which tables have no dependencies

  return { model: model, orderedTables: orderedTables };

  function topologicalSort(links) {
    return (0, _tsort2.default)(links).sort(); // Note: `tsort` only sets up the graph, must call `sort` to get the ordering. I had initially begun to implement my own topological sort, as `model` already contains a graph of the dependencies, but abandoned it due to finding this library function. If performance is ever a concern, there is a bit of optimization that can be done here.
  }

  function getSchemaLinks(_ref) {
    var schemaName = _ref.name;
    var tables = _ref.tables;

    return _lodash2.default.flatMap(_lodash2.default.map(tables, getTableLinks));

    function getTableLinks(table) {
      var name = table.name;
      var dependencies = table.dependencies;

      if (dependencies.length === 0) return [[schemaName + '.' + name, '*']];
      return _lodash2.default.map(dependencies, function (_ref2) {
        var _ref2$reference = _ref2.reference;
        var schema = _ref2$reference.schema;
        var table = _ref2$reference.table;
        return [schemaName + '.' + name, (schema || schemaName) + '.' + table];
      });
    }
  }
}