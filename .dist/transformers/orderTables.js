"use strict";
var $__lodash__,
    $__tsort__;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
var tsort = ($__tsort__ = require("tsort"), $__tsort__ && $__tsort__.__esModule && $__tsort__ || {default: $__tsort__}).default;
function orderTables(model) {
  var schemas = model.schemas;
  var orderedTables = _.reject(topologicalSort(_.flatMap(_.map(schemas, getSchemaLinks))).reverse(), function(v) {
    return v === '*';
  });
  return {
    model: model,
    orderedTables: orderedTables
  };
  function topologicalSort(links) {
    return tsort(links).sort();
  }
  function getSchemaLinks($__4) {
    var $__5 = $__4,
        schemaName = $__5.name,
        tables = $__5.tables;
    return _.flatMap(_.map(tables, getTableLinks));
    function getTableLinks(table) {
      var $__6 = table,
          name = $__6.name,
          dependencies = $__6.dependencies;
      if (dependencies.length === 0)
        return [[(schemaName + "." + name), '*']];
      return _.map(dependencies, function($__7) {
        var $__9 = $__7.reference,
            schema = $__9.schema,
            table = $__9.table;
        return [(schemaName + "." + name), ((schema || schemaName) + "." + table)];
      });
    }
  }
}
var $__default = orderTables;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=orderTables.js.map
