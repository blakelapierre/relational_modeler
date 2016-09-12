import {join, first, prepend, single} from './util';

const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';

export default {
  ListOf_some (element, separator, rest) {
    return prepend(element, rest);
  },

  ListOf_none () {
    return undefined;
  },

  CContained (open, element, close) {
    return single(element);
  },

  Model (name, commonAttributes, schemas) {
    return join({name, commonAttributes: first(commonAttributes) || [], schemas});
  },

  Schema (name, commonAttributes, tables) {
    return join({name, commonAttributes: first(commonAttributes) || [], tables});
  },

  Table (name, attributes, dependencies) {
    return join({name, attributes: first(attributes), dependencies});
  },

  Attribute (primaryKeyOrUnique, name, optional, type, check) {
    primaryKeyOrUnique = first(primaryKeyOrUnique) || {};
    type = first(type) || (primaryKeyOrUnique.primaryKey ? defaultPrimaryKeyType : defaultType);
    return Object.assign(join({
      name,
      optional: first(optional) === '?',
      type,
      check: first(check) // using first() here is a little bit of a hack; I want check to be undefined if there is none specified, without calling first() it is an empty array
    }), primaryKeyOrUnique);
  },

  PrimaryKey:
    primaryKey => join({primaryKey: first(primaryKey) === '@'}),

  Unique:
    unique => join({unique: first(unique) === '!'}),

  Optional:
    optional => first(optional) === '?',

  Type (type) {
    return single(type);
  },

  List (values) {
    return join({type: 'List', values});
  },

  Set (values) {
    return join({type: 'Set', values});
  },

  Constraint: (operator, value) => join({operator, value}),

  Operator:
    symbol => single(symbol),

  CheckName:
    name => join({check: 'Name', name}),

  CheckNumber:
    number => join({check: 'Number', number}),

  Dependency (preArity, glyph, postArity, primaryKeyOrUnique, reference, optional, name) {
    primaryKeyOrUnique = first(primaryKeyOrUnique) || {};
    return Object.assign(join({
      preArity: first(preArity) || '*',
      postArity: first(postArity) || '*',
      reference,
      optional: first(optional) === true,
      name: first(name)
    }), primaryKeyOrUnique);
  },

  SchemaTableName (schema, dot, table) {
    return join({schema, table});
  },

  TableName (table) {
    return join({table});
  },

  name (first_character, additional_characters) {
    return this.interval.contents;
  }
};