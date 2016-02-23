"use strict";
var $__util__;
var $__0 = ($__util__ = require("./util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}),
    join = $__0.join,
    first = $__0.first;
var defaultType = 'text',
    defaultPrimaryKeyType = 'bigserial';
var $__default = {
  ListOf_some: function(element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },
  CContained: function(open, element, close) {
    return element.toObject();
  },
  Model: function(name, commonAttributes, schemas) {
    return join({
      name: name,
      commonAttributes: first(commonAttributes) || [],
      schemas: schemas
    });
  },
  Schema: function(name, commonAttributes, tables) {
    return join({
      name: name,
      commonAttributes: first(commonAttributes) || [],
      tables: tables
    });
  },
  Table: function(name, attributes, dependencies) {
    return join({
      name: name,
      attributes: first(attributes),
      dependencies: dependencies
    });
  },
  Attribute: function(primaryKey, name, optional, type) {
    primaryKey = first(primaryKey) === '!';
    type = first(type) || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return join({
      name: name,
      primaryKey: primaryKey,
      optional: first(optional) === '?',
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
  Dependency: function(preArity, glyph, postArity, reference) {
    return join({
      preArity: first(preArity) || '*',
      postArity: first(postArity) || '*',
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
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=RM.toObject.semantics.js.map
