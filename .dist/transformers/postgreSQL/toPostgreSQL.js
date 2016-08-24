'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = toPostgreSQL;
exports.resolveDependencies = resolveDependencies;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sql = require('./sql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toPostgreSQL(_ref) {
  var model = _ref.model;
  var orderedTables = _ref.orderedTables;
  var delimiter = arguments.length <= 1 || arguments[1] === undefined ? ',' : arguments[1];
  var quote = arguments.length <= 2 || arguments[2] === undefined ? '"' : arguments[2];
  var modelAttributes = model.commonAttributes;
  var schemas = model.schemas;


  var schemaMap = _lodash2.default.transform(schemas, function (map, schema) {
    return map[schema.name] = addTableMap(schema);
  }, {});

  model.schemaMap = schemaMap; // mutation of passed object!

  resolveDependencies(schemas, schemaMap);

  return {
    schema: [(0, _sql.createDatabase)(model.name)].concat(createSchemas(schemas, schemaMap, orderedTables)),
    imports: createImports(orderedTables)
  };

  function addTableMap(schema) {
    schema.tableMap = _lodash2.default.transform(schema.tables, function (map, table) {
      return map[table.name] = table;
    }, {});
    return schema;
  }

  // This should be broken out into a separate model, but we want the schema map and that is here!
  function resolveDependencies(schemas, schemaMap) {
    schemas.forEach(function (_ref2) {
      var tables = _ref2.tables;
      return tables.forEach(function (table) {
        return table.primaryKeys = _lodash2.default.filter(table.attributes, function (a) {
          return a.primaryKey;
        });
      });
    });
    schemas.forEach(function (_ref3) {
      var name = _ref3.name;
      var tables = _ref3.tables;

      return tables.forEach(function (table) {
        var tableName = table.name;
        var dependencies = table.dependencies;

        return dependencies.forEach(function (_ref4) {
          var reference = _ref4.reference;

          reference.attribute = schemaMap[reference.schema || name].tableMap[reference.table].primaryKeys[0];
        });
      });
    });
  }

  function createSchemas(schemas, schemaMap, orderedTables) {
    return _lodash2.default.concat(_lodash2.default.map(_lodash2.default.keys(schemaMap), _sql.createSchema), // Produce all schemas first
    _lodash2.default.flatMap(orderedTables, processTable));
  }

  function createImports(orderedTables) {
    var extension = arguments.length <= 1 || arguments[1] === undefined ? '.txt' : arguments[1];

    return orderedTables.map(function (qualifiedTableName) {
      return run(copy(qualifiedTableName), fileName(qualifiedTableName));
    });

    function run(command, file) {
      return 'run "' + command + '" "' + file + '"';
    }

    function copy(qualifiedTableName) {
      return 'BEGIN; COPY ' + qualifiedTableName + ' FROM STDIN WITH CSV DELIMITER \'' + delimiter + '\' QUOTE \'' + quote + '\'; COMMIT;';
    }

    function fileName(name) {
      var _name$split = name.split('.');

      var _name$split2 = _slicedToArray(_name$split, 2);

      var schemaName = _name$split2[0];
      var tableName = _name$split2[1];


      tableName = tableName || schemaName;

      return '' + tableName + extension;
    }
  }

  function processTable(qualifiedTableName) {
    var _qualifiedTableName$s = qualifiedTableName.split('.');

    var _qualifiedTableName$s2 = _slicedToArray(_qualifiedTableName$s, 2);

    var schemaName = _qualifiedTableName$s2[0];
    var tableName = _qualifiedTableName$s2[1];


    var commands = [];

    var schema = schemaMap[schemaName];
    var schemaAttributes = schema.commonAttributes;
    var table = schema.tableMap[tableName];
    var attributes = _lodash2.default.flatMap([modelAttributes, schemaAttributes, table.attributes]);
    var primaryKeys = table.primaryKeys;
    var columns = _lodash2.default.map(attributes, generateAttribute).concat(_lodash2.default.map(table.dependencies, generateDependency)).join(', ');

    var constraints = [];

    if (primaryKeys.length > 0) constraints.push('PRIMARY KEY (' + primaryKeys.map(function (a) {
      return a.name;
    }) + ')');

    commands.push((0, _sql.createTable)(schemaName + '.' + tableName, columns, constraints));

    return commands;

    function generateAttribute(_ref5) {
      var name = _ref5.name;
      var primaryKey = _ref5.primaryKey;
      var optional = _ref5.optional;
      var type = _ref5.type;

      var parts = [name, type ? formatType(type) : 'text'];

      if (primaryKey && optional) throw new Error(schemaName + '.' + tableName + '.' + name + ' cannot be both a primary key and optional!'); // maybe outlaw this in the grammar?

      if (!primaryKey && !optional) parts.push('NOT NULL');

      return parts.join(' ');

      function formatType(type) {
        if (typeof type === 'string') {
          if (type === 'timestamp') return type + ' DEFAULT now()';
          return type;
        }

        if (type.type === 'Set') {
          // These names are guaranteed to be unique, but maybe we want a way to de-duplicate equivalent types?
          var newTypeName = tableName + '_' + name + '_enum';
          commands.push((0, _sql.createType)(schemaName + '.' + newTypeName, type.values));

          return newTypeName + ' DEFAULT \'' + type.values[0] + '\'';
        } else if (type.type === 'Numeric') {
          var parameters = [];
          if (type.precision !== undefined) parameters.push(type.precision);
          if (type.scale !== undefined) parameters.push(type.scale);

          if (parameters.length > 0) return 'NUMERIC(' + parameters.join(',') + ')';
          return 'NUMERIC';
        } else if (type.type === 'Blob') {
          return 'BYTEA';
        } else if (type.type === 'VarChar') {
          if (type.length !== undefined) return 'VARCHAR(' + type.length + ')';
          return 'VARCHAR';
        } else throw new Error(type.type + ' not implemented!');
      }
    }

    function generateDependency(_ref6) {
      var preArity = _ref6.preArity;
      var postArity = _ref6.postArity;
      var _ref6$reference = _ref6.reference;
      var schema = _ref6$reference.schema;
      var table = _ref6$reference.table;
      var attribute = _ref6$reference.attribute;

      var id = (schema === undefined ? '' : (schema || schemaName) + '_') + (table + '_' + (attribute || { name: 'id' }).name),
          references = (schema || schemaName) + '.' + table;

      var type = (attribute || { type: 'bigint' }).type;

      if (typeof type !== 'string') type = type.type;
      type = type + ' NOT NULL';

      if (preArity === 1 && postArity === 1) type += ' UNIQUE';

      return id + ' ' + type + ' REFERENCES ' + references;
    }
  }
}

function resolveDependencies(_ref7) {
  var schemas = _ref7.schemas;

  schemas.forEach(function (_ref8) {
    var tables = _ref8.tables;
  });
}

// get primaryKeys() { return _.filter(attributes, a => a.primaryKey); }