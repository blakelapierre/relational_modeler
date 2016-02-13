"use strict";
var $__lodash__,
    $__sql__;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
var $__1 = ($__sql__ = require("./sql"), $__sql__ && $__sql__.__esModule && $__sql__ || {default: $__sql__}),
    createSchema = $__1.createSchema,
    createTable = $__1.createTable,
    createType = $__1.createType;
function toPostgreSQL($__3) {
  var $__4 = $__3,
      model = $__4.model,
      orderedTables = $__4.orderedTables;
  var $__5 = model,
      modelAttributes = $__5.commonAttributes,
      schemas = $__5.schemas;
  var schemaMap = _.transform(schemas, function(map, schema) {
    return map[schema.name] = addTableMap(schema);
  }, {});
  model.schemaMap = schemaMap;
  return createSchemas(schemas, schemaMap, orderedTables);
  function addTableMap(schema) {
    schema.tableMap = _.transform(schema.tables, function(map, table) {
      return map[table.name] = table;
    }, {});
    return schema;
  }
  function createSchemas(schemas, schemaMap, orderedTables) {
    return _.concat(_.map(_.keys(schemaMap), createSchema), _.flatMap(orderedTables, processTable));
  }
  function processTable(qualifiedTableName) {
    var $__7,
        $__8;
    var $__6 = qualifiedTableName.split('.'),
        schemaName = ($__7 = $__6[Symbol.iterator](), ($__8 = $__7.next()).done ? void 0 : $__8.value),
        tableName = ($__8 = $__7.next()).done ? void 0 : $__8.value;
    var commands = [];
    var schema = schemaMap[schemaName],
        schemaAttributes = schema.commonAttributes,
        table = schema.tableMap[tableName],
        attributes = _.flatMap([modelAttributes, schemaAttributes, table.attributes]),
        columns = _.map(attributes, generateAttribute).concat(_.map(table.dependencies, generateDependency)).join(', ');
    commands.push(createTable((schemaName + "." + tableName), columns));
    return commands;
    function generateAttribute($__10) {
      var $__11 = $__10,
          name = $__11.name,
          primaryKey = $__11.primaryKey,
          optional = $__11.optional,
          type = $__11.type;
      var parts = [name, type ? formatType(type) : 'text'];
      if (primaryKey && optional)
        throw new Error((schemaName + "." + tableName + "." + name + " cannot be both a primary key and optional!"));
      if (primaryKey)
        parts.push('PRIMARY KEY');
      else if (!optional)
        parts.push('NOT NULL');
      return parts.join(' ');
      function formatType(type) {
        if (typeof type === 'string') {
          if (type === 'timestamp')
            return (type + " DEFAULT now()");
          return type;
        }
        if (type.type === 'Set') {
          var newTypeName = (tableName + "_" + name + "_enum");
          commands.push(createType((schemaName + "." + newTypeName), type.values));
          return (newTypeName + " DEFAULT '" + type.values[0] + "'");
        } else if (type.type === 'Numeric') {
          var parameters = [];
          if (type.precision !== undefined)
            parameters.push(type.precision);
          if (type.scale !== undefined)
            parameters.push(type.scale);
          if (parameters.length > 0)
            return ("NUMERIC(" + parameters.join(',') + ")");
          return "NUMERIC";
        } else if (type.type === 'Blob') {
          return "BYTEA";
        } else
          throw new Error((type.type + " not implemented!"));
      }
    }
    function generateDependency($__10) {
      var $__11 = $__10,
          preArity = $__11.preArity,
          postArity = $__11.postArity,
          $__12 = $__11.reference,
          schema = $__12.schema,
          table = $__12.table;
      var id = (schema === undefined ? '' : ((schema || schemaName) + "_")) + (table + "_id"),
          references = ((schema || schemaName) + "." + table);
      var type = 'bigint NOT NULL';
      if (postArity === 1)
        type += ' UNIQUE';
      return (id + " " + type + " REFERENCES " + references);
    }
  }
}
var $__default = toPostgreSQL;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=toPostgreSQL.js.map
