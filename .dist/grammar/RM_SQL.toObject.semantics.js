"use strict";
var defaultType = 'text',
    defaultPrimaryKeyType = 'bigserial';
var $__default = {
  ListOf_some: function(element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },
  IContained: function(open, element, close) {
    return element.toObject();
  },
  Model: function(name, commonAttributes, schemas) {
    return join({
      name: name,
      commonAttributes: commonAttributes.toObject()[0] || [],
      schemas: schemas
    });
  },
  Schema: function(name, commonAttributes, tables) {
    return join({
      name: name,
      commonAttributes: commonAttributes.toObject()[0] || [],
      tables: tables
    });
  },
  Table: function(name, attributes, dependencies) {
    return join({
      name: name,
      attributes: attributes.toObject()[0],
      dependencies: dependencies
    });
  },
  Attribute: function(primaryKey, name, optional, type) {
    primaryKey = primaryKey.toObject()[0] === '!';
    type = type.toObject()[0] || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return join({
      name: name,
      primaryKey: primaryKey,
      optional: optional.toObject()[0] === '?',
      type: type
    });
  },
  Type: function(type) {
    return type.toObject();
  },
  List: function(values) {
    return join({
      type: 'List',
      values: values
    });
  },
  Set: function(values) {
    return join({
      type: 'Set',
      values: values
    });
  },
  Numeric: function(numeric, parameters) {
    return parameters.toObject()[0] || {type: 'Numeric'};
  },
  NumericParameters: function(precision, optionalScale) {
    return join({
      type: 'Numeric',
      precision: precision,
      scale: optionalScale.toObject()[0]
    });
  },
  OptionalScale: function(comma, scale) {
    return scale;
  },
  number: function(digits) {
    return parseInt(digits.toObject().join(''), 10);
  },
  Dependency: function(preArity, glyph, postArity, reference) {
    return join({
      preArity: function($) {
        return $(preArity)[0] || 1;
      },
      postArity: function($) {
        return $(postArity)[0] || 1;
      },
      reference: reference
    });
  },
  SchemaTableName: function(schema, dot, table) {
    return join({
      schema: schema,
      table: table
    });
  },
  TableName: function(table) {
    return join({table: table});
  },
  name: function(first_character, additional_characters) {
    return this.interval.contents;
  }
};
function join(obj) {
  for (var key in obj) {
    var value = obj[key];
    if (value === undefined)
      continue;
    else if (typeof value === 'function')
      obj[key] = value(function(o) {
        return o.toObject();
      });
    else if (value.toObject)
      obj[key] = value.toObject();
  }
  return obj;
}
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=RM_SQL.toObject.semantics.js.map
