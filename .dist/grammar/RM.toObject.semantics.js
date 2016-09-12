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
  ListOf_none: function ListOf_none() {
    return undefined;
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
  Attribute: function Attribute(primaryKeyOrUnique, name, optional, type, check) {
    primaryKeyOrUnique = (0, _util.first)(primaryKeyOrUnique) || {};
    type = (0, _util.first)(type) || (primaryKeyOrUnique.primaryKey ? defaultPrimaryKeyType : defaultType);
    return Object.assign((0, _util.join)({
      name: name,
      optional: (0, _util.first)(optional) === '?',
      type: type,
      check: (0, _util.first)(check) // using first() here is a little bit of a hack; I want check to be undefined if there is none specified, without calling first() it is an empty array
    }), primaryKeyOrUnique);
  },


  PrimaryKey: function PrimaryKey(primaryKey) {
    return (0, _util.join)({ primaryKey: (0, _util.first)(primaryKey) === '@' });
  },

  Unique: function Unique(unique) {
    return (0, _util.join)({ unique: (0, _util.first)(unique) === '!' });
  },

  Optional: function Optional(optional) {
    return (0, _util.first)(optional) === '?';
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


  Constraint: function Constraint(operator, value) {
    return (0, _util.join)({ operator: operator, value: value });
  },

  Operator: function Operator(symbol) {
    return (0, _util.single)(symbol);
  },

  CheckName: function CheckName(name) {
    return (0, _util.join)({ check: 'Name', name: name });
  },

  CheckNumber: function CheckNumber(number) {
    return (0, _util.join)({ check: 'Number', number: number });
  },

  Dependency: function Dependency(preArity, glyph, postArity, primaryKeyOrUnique, reference, optional, name) {
    primaryKeyOrUnique = (0, _util.first)(primaryKeyOrUnique) || {};
    return Object.assign((0, _util.join)({
      preArity: (0, _util.first)(preArity) || '*',
      postArity: (0, _util.first)(postArity) || '*',
      reference: reference,
      optional: (0, _util.first)(optional) === true,
      name: (0, _util.first)(name)
    }), primaryKeyOrUnique);
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