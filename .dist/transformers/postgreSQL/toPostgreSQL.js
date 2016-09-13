'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = toPostgreSQL;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _SemanticError = require('../../SemanticError');

var _SemanticError2 = _interopRequireDefault(_SemanticError);

var _sql = require('./sql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Should be moved out somewhere else
var importMethods = {
  'psql': function psql(delimiter, quote) {
    return '#!/bin/bash\n\nPOSTGRES_HOST=localhost\nPOSTGRES_PORT=5432\nPOSTGRES_USER=postgres\nPOSTGRES_DATABASE=usda\nENCODING=SQL_ASCII\nDELIMITER=\'' + delimiter + '\'\nQUOTE=\'' + quote + '\'\nNULL=\n\n# if nc -h; then\n#      until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do\n#           echo "$(date) - waiting on postgre..."\n#           sleep 1\n#      done\n# fi\n\ncopy() {\n     COMMAND="SET client_encoding = \'${ENCODING}\'; BEGIN; COPY ${1} (${3}) FROM STDIN WITH CSV DELIMITER \'${DELIMITER}\' QUOTE \'${QUOTE}\' ENCODING \'${ENCODING}\' NULL \'${NULL}\'; COMMIT;"\n\n     echo "running $COMMAND"\n\n     psql -h "$POSTGRES_HOST" \\\n          -p "$POSTGRES_PORT" \\\n          -d "$POSGRES_DATABASE" \\\n          -U "$POSTGRES_USER" \\\n          -x \\\n          -v ON_ERROR_STOP=1 \\\n          -c "$COMMAND" \\\n          < $2\n}';
  },
  'docker': function docker(delimiter, quote) {
    return '#!/bin/bash\n\nPOSTGRES_HOST=postgres-usda\nPOSTGRES_PORT=5432\nPOSTGRES_USER=postgres\nPOSTGRES_DATABASE=usda\nENCODING=SQL_ASCII\nDELIMITER=\'' + delimiter + '\'\nQUOTE=\'' + quote + '\'\nNULL=\n\n# if nc -h; then\n#      until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do\n#           echo "$(date) - waiting on postgre..."\n#           sleep 1\n#      done\n# fi\n\ncopy() {\n     SQL_COMMAND="SET client_encoding = \'${ENCODING}\'; BEGIN; COPY ${1} (${3}) FROM STDIN WITH CSV DELIMITER \'${DELIMITER}\' QUOTE \'${QUOTE}\' ENCODING \'${ENCODING}\' NULL \'${NULL}\'; COMMIT;"\n     COMMAND="psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -x -v ON_ERROR_STOP=1 -c \\"$SQL_COMMAND\\"  < \\"/data/${2}\\""\n\n     echo "running $COMMAND"\n\n     docker run --rm -it \\\n                --link "$POSTGRES_HOST" \\\n               -v $(pwd)/data:/data:z \\\n               postgres /bin/bash -c "$COMMAND"\n}\n';
  }
};

function toPostgreSQL(_ref) {
  var model = _ref.model;
  var orderedTables = _ref.orderedTables;
  var delimiter = arguments.length <= 1 || arguments[1] === undefined ? ',' : arguments[1];
  var quote = arguments.length <= 2 || arguments[2] === undefined ? '"' : arguments[2];
  var importMethod = arguments.length <= 3 || arguments[3] === undefined ? 'psql' : arguments[3];

  model = new Model(model);
  var _model = model;
  var modelAttributes = _model.commonAttributes;
  var schemas = _model.schemas;


  var schemaMap = _lodash2.default.transform(schemas, function (map, schema) {
    return map[schema.name] = addTableMap(schema);
  }, {});

  model.schemaMap = schemaMap; // mutation of passed object!

  resolveDependencies(schemas, schemaMap, orderedTables);

  return {
    schema: [(0, _sql.createDatabase)(model.name)].concat(createSchemas(schemas, schemaMap, orderedTables)),
    imports: createImports(orderedTables, importMethod, schemaMap)
  };

  function addTableMap(schema) {
    schema.tableMap = _lodash2.default.transform(schema.tables, function (map, table) {
      return map[table.name] = table;
    }, {});
    return schema;
  }

  // This should be broken out into a separate model (module?), but we want the schema map and that is here!
  function resolveDependencies(schemas, schemaMap, orderedTables) {
    schemas.forEach(function (_ref2) {
      var name = _ref2.name;
      var tables = _ref2.tables;
      return tables.forEach(function (_ref3) {
        var tableName = _ref3.name;
        var dependencies = _ref3.dependencies;
        return dependencies.forEach(function (_ref4) {
          var reference = _ref4.reference;
          return reference.attribute = getTable(schemaMap, reference.schema || name, reference.table).primaryKeys[0];
        });
      });
    });
  }

  function getTable(schemaMap, schemaName, tableName) {
    var table = getSchema(schemaMap, schemaName).tableMap[tableName];

    if (!table) throw new _SemanticError2.default('No Table "' + schemaName + '"."' + tableName + '"!');

    return table;
  }

  function getSchema(schemaMap, schemaName) {
    var schema = schemaMap[schemaName];

    if (!schema) throw new _SemanticError2.default('No Schema "' + schemaName + '"!');

    return schema;
  }

  function createSchemas(schemas, schemaMap, orderedTables) {
    return _lodash2.default.concat(_lodash2.default.map(_lodash2.default.keys(schemaMap), _sql.createSchema), // Produce all schemas first
    _lodash2.default.flatMap(orderedTables, processTable));
  }

  function createImports(orderedTables, importMethod, schemaMap) {
    var extension = arguments.length <= 3 || arguments[3] === undefined ? '.txt' : arguments[3];

    return [importMethods[importMethod](delimiter, quote)].concat(orderedTables.map(function (qualifiedTableName) {
      return copy(tableName(qualifiedTableName), fileName(qualifiedTableName), columns(qualifiedTableName, schemaMap));
    }));

    function copy(table, file, columns) {
      return 'copy \'' + table + '\' "' + file + '" \'' + columns + '\'';
    }

    function columns(qualifiedTableName, schemaMap) {
      var _qualifiedTableName$s = qualifiedTableName.split('.');

      var _qualifiedTableName$s2 = _slicedToArray(_qualifiedTableName$s, 2);

      var schemaName = _qualifiedTableName$s2[0];
      var tableName = _qualifiedTableName$s2[1];
      var schema = schemaMap[schemaName] || { tableMap: [] };
      var table = schema.tableMap[tableName];

      if (!table) throw new _SemanticError2.default('No "' + schemaName + '"."' + tableName + '"!');

      return table.columns.map(function (_ref5) {
        var name = _ref5.name;
        return '\\"' + name + '\\"';
      }).join(", ");
    }

    function tableName(qualifiedTableName) {
      // should support something like: (${columnList}) so that imports can more easily be customized to the column order of the data file

      var _qualifiedTableName$s3 = qualifiedTableName.split('.');

      var _qualifiedTableName$s4 = _slicedToArray(_qualifiedTableName$s3, 2);

      var schema = _qualifiedTableName$s4[0];
      var table = _qualifiedTableName$s4[1];

      return '\\"' + schema + '\\".\\"' + table + '\\"';
    }

    function fileName(name) {
      var _name$split = name.split('.');

      var _name$split2 = _slicedToArray(_name$split, 2);

      var schemaName = _name$split2[0];
      var tableName = _name$split2[1];


      return schemaName + '/' + tableName + extension;
    }
  }

  function processTable(qualifiedTableName) {
    var _qualifiedTableName$s5 = qualifiedTableName.split('.');

    var _qualifiedTableName$s6 = _slicedToArray(_qualifiedTableName$s5, 2);

    var schemaName = _qualifiedTableName$s6[0];
    var tableName = _qualifiedTableName$s6[1];


    var commands = [];

    var schema = schemaMap[schemaName];
    var schemaAttributes = schema.commonAttributes;
    var table = schema.tableMap[tableName];
    var attributes = _lodash2.default.flatMap([modelAttributes, schemaAttributes, table.attributes || []]);
    var primaryKeys = table.primaryKeys;
    var unique = table.unique;
    var columns = _lodash2.default.map(attributes, generateAttribute).concat(_lodash2.default.map(table.dependencies, generateDependency)).join(', ');

    var constraints = [];

    if (primaryKeys.length > 0) constraints.push('PRIMARY KEY (' + primaryKeys.map(function (_ref6) {
      var name = _ref6.name;
      return '"' + name + '"';
    }).join(', ') + ')');
    if (unique.length > 0) constraints.push('UNIQUE (' + unique.map(function (_ref7) {
      var name = _ref7.name;
      return '"' + name + '"';
    }) + ')');

    commands.push((0, _sql.createTable)('"' + schemaName + '"."' + tableName + '"', columns, constraints));

    return commands;

    function generateAttribute(_ref8) {
      var name = _ref8.name;
      var primaryKey = _ref8.primaryKey;
      var optional = _ref8.optional;
      var type = _ref8.type;
      var check = _ref8.check;

      var parts = ['"' + name + '"', type ? formatType(type) : 'text'];

      if (primaryKey && optional) throw new Error('"' + schemaName + '"."' + tableName + '"."' + name + '" cannot be both a primary key and optional!'); // maybe outlaw this in the grammar?

      if (!primaryKey && !optional) parts.push('NOT NULL');

      if (check) {
        (function () {
          var operator = check.operator;
          var value = check.value;


          if (value.check === 'Number') parts.push('CHECK ("' + name + '" ' + operator + ' "' + value.number + '")');else if (value.check === 'Name') {
            if (!_lodash2.default.some(attributes, function (attribute) {
              return attribute.name === value.name;
            })) throw new _SemanticError2.default('Cannot check against "' + value.name + '", it is not an attribute of "' + table.name + '"!'); // should also type-check here
            parts.push('CHECK ("' + name + '" ' + operator + ' "' + value.name + '")');
          } else throw new Error('!', value);
        })();
      }

      return parts.join(' ');

      function formatType(type) {
        if (typeof type === 'string') {
          if (type === 'timestamp') return type + ' DEFAULT now()';
          return type;
        }

        if (type.type === 'Set') {
          // These names are guaranteed to be unique, but maybe we want a way to de-duplicate equivalent types?
          var newTypeName = '"' + schemaName + '"."' + tableName + '_' + name + '_enum"';
          commands.push((0, _sql.createType)('' + newTypeName, type.values));

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

    function generateDependency(_ref9) {
      var name = _ref9.name;
      var preArity = _ref9.preArity;
      var postArity = _ref9.postArity;
      var _ref9$reference = _ref9.reference;
      var schema = _ref9$reference.schema;
      var table = _ref9$reference.table;
      var attribute = _ref9$reference.attribute;
      var optional = _ref9.optional;

      var id = name || (schema === undefined ? '' : (schema || schemaName) + '_') + (table + '_' + (attribute || { name: 'id' }).name),
          references = '"' + (schema || schemaName) + '"."' + table + '"';

      var type = (attribute || { type: 'bigint' }).type;

      if (typeof type !== 'string') type = type.type;
      if (!optional) type = type + ' NOT NULL';

      if (preArity === 1 && postArity === 1) type += ' UNIQUE';

      return '"' + id + '" ' + type + ' REFERENCES ' + references;
    }
  }
}

// get primaryKeys() { return _.filter(attributes, a => a.primaryKey); }

var Model = function Model(_ref10) {
  var _this = this;

  var commonAttributes = _ref10.commonAttributes;
  var name = _ref10.name;
  var schemas = _ref10.schemas;

  _classCallCheck(this, Model);

  this.commonAttributes = commonAttributes;
  this.name = name;
  this.schemas = _lodash2.default.map(schemas, function (schema) {
    return new Schema(_this, schema);
  });
};

var Schema = function Schema(model, _ref11) {
  var _this2 = this;

  var name = _ref11.name;
  var commonAttributes = _ref11.commonAttributes;
  var tables = _ref11.tables;

  _classCallCheck(this, Schema);

  this.model = model;
  this.name = name;
  this.commonAttributes = commonAttributes;
  this.tables = _lodash2.default.map(tables, function (table) {
    return new Table(_this2, table);
  });
};

var Table = function () {
  function Table(schema, _ref12) {
    var name = _ref12.name;
    var attributes = _ref12.attributes;
    var dependencies = _ref12.dependencies;

    _classCallCheck(this, Table);

    this.schema = schema;
    this.name = name;
    this.attributes = attributes;
    this.dependencies = dependencies;
  }

  _createClass(Table, [{
    key: 'model',
    get: function get() {
      return schema.model;
    }
  }, {
    key: 'columns',
    get: function get() {
      var schema = this.schema;
      var tableAttributes = this.attributes;
      var dependencies = this.dependencies;
      var schemaAttributes = schema.commonAttributes;
      var model = schema.model;
      var modelAttributes = model.commonAttributes;
      var schemaMap = model.schemaMap;


      return _lodash2.default.concat(modelAttributes, schemaAttributes, tableAttributes, _lodash2.default.map(dependencies, function (_ref13) {
        var name = _ref13.name;
        var _ref13$reference = _ref13.reference;
        var schemaName = _ref13$reference.schema;
        var tableName = _ref13$reference.table;
        return (//console.log(schemaMap[schemaName || schema.name].tableMap[tableName]) &
          {
            name: name || (schemaName === undefined ? '' : (schemaName || schema.name) + '_') + (tableName + '_' + (schemaMap[schemaName || schema.name].tableMap[tableName].primaryKeys[0] || { name: 'id' }).name)
          }
        );
      }));
    }
  }, {
    key: 'primaryKeys',
    get: function get() {
      // console.log({this});
      var schema = this.schema;
      var tableAttributes = this.attributes;
      var dependencies = this.dependencies;
      var schemaAttributes = schema.commonAttributes;
      var model = schema.model;
      var modelAttributes = model.commonAttributes;
      var schemaMap = model.schemaMap;


      return _lodash2.default.concat(_lodash2.default.filter(modelAttributes, function (a) {
        return a.primaryKey;
      }), _lodash2.default.filter(schemaAttributes, function (a) {
        return a.primaryKey;
      }), _lodash2.default.filter(tableAttributes, function (a) {
        return a.primaryKey;
      }), _lodash2.default.map(_lodash2.default.filter(dependencies, function (d) {
        return d.primaryKey;
      }), function (_ref14) {
        var name = _ref14.name;
        var _ref14$reference = _ref14.reference;
        var schemaName = _ref14$reference.schema;
        var tableName = _ref14$reference.table;
        return (//console.log(schemaMap[schemaName || schema.name].tableMap[tableName]) &
          {
            name: name || (schemaName === undefined ? '' : (schemaName || schema.name) + '_') + (tableName + '_' + (schemaMap[schemaName || schema.name].tableMap[tableName].primaryKeys[0] || { name: 'id' }).name)
          }
        );
      }));
    }
  }, {
    key: 'unique',
    get: function get() {
      var schema = this.schema;
      var tableAttributes = this.attributes;
      var dependencies = this.dependencies;
      var schemaAttributes = schema.commonAttributes;
      var model = schema.model;
      var modelAttributes = model.commonAttributes;
      var schemaMap = model.schemaMap;


      return _lodash2.default.concat(_lodash2.default.filter(modelAttributes, function (a) {
        return a.unique;
      }), _lodash2.default.filter(schemaAttributes, function (a) {
        return a.unique;
      }), _lodash2.default.filter(tableAttributes, function (a) {
        return a.unique;
      }), _lodash2.default.map(_lodash2.default.filter(dependencies, function (d) {
        return d.unique;
      }), function (_ref15) {
        var name = _ref15.name;
        var _ref15$reference = _ref15.reference;
        var schemaName = _ref15$reference.schema;
        var tableName = _ref15$reference.table;
        return (//console.log(schemaMap[schemaName || schema.name].tableMap[tableName]) &
          {
            name: name || (schemaName === undefined ? '' : (schemaName || schema.name) + '_') + (tableName + '_' + (schemaMap[schemaName || schema.name].tableMap[tableName].primaryKeys[0] || { name: 'id' }).name)
          }
        );
      }));
    }
  }]);

  return Table;
}();