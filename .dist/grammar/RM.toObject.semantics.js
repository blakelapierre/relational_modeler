'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var defaultType = 'text',
    defaultPrimaryKeyType = 'bigserial';

exports.default = {
  ListOf_some: function ListOf_some(element, separator, rest) {
    return (0, _util.prepend)(element, rest);
  },
  CContained: function CContained(open, element, close) {
    return (0, _util.single)(element);
  },
  Model: function Model(name, commonAttributes, schemas) {
    return (0, _util.join)({ name: name, commonAttributes: (0, _util.first)(commonAttributes) || [], schemas: schemas });
  },
  Schema: function Schema(name, commonAttributes, tables) {
    return (0, _util.join)({ name: name, commonAttributes: (0, _util.first)(commonAttributes) || [], tables: tables });
  },
  Table: function Table(name, attributes, dependencies) {
    return (0, _util.join)({ name: name, attributes: (0, _util.first)(attributes), dependencies: dependencies });
  },
  Attribute: function Attribute(primaryKey, name, optional, type) {
    primaryKey = (0, _util.first)(primaryKey) === '!';
    type = (0, _util.first)(type) || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return (0, _util.join)({ name: name, primaryKey: primaryKey, optional: (0, _util.first)(optional) === '?', type: type });
  },
  Type: function Type(type) {
    return (0, _util.single)(type);
  },
  List: function List(values) {
    return (0, _util.join)({ type: 'List', values: values });
  },
  Set: function Set(values) {
    return (0, _util.join)({ type: 'Set', values: values });
  },
  Dependency: function Dependency(preArity, glyph, postArity, primaryKey, reference, optional, name) {
    return (0, _util.join)({
      preArity: (0, _util.first)(preArity) || '*',
      postArity: (0, _util.first)(postArity) || '*',
      primaryKey: (0, _util.first)(primaryKey) === '!',
      reference: reference,
      optional: optional,
      name: (name || '').length > 0 ? name : undefined
    });
  },
  SchemaTableName: function SchemaTableName(schema, dot, table) {
    return (0, _util.join)({ schema: schema, table: table });
  },
  TableName: function TableName(table) {
    return (0, _util.join)({ table: table });
  },
  name: function name(first_character, additional_characters) {
    return this.interval.contents;
  }
};