import {join, first, prepend, single} from './util';

const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';

export default {
  ListOf_some (element, separator, rest) {
    return prepend(element, rest);
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

  Attribute (primaryKey, name, optional, type, check) {
    primaryKey = first(primaryKey) === '!';
    type = first(type) || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return join({
      name,
      primaryKey,
      optional: first(optional) === '?',
      type,
      check: first(check) // using first() here is a little bit of a hack; I want check to be undefined if there is none specified, without calling first() it is an empty array
    });
  },

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

  Operator: symbol => single(symbol),

  CheckName: name => join({check: 'Name', name}),

  CheckNumber: number => join({check: 'Number', number}),

  Dependency (preArity, glyph, postArity, primaryKey, reference, optional, name) {
    return join({
      preArity: first(preArity) || '*',
      postArity: first(postArity) || '*',
      primaryKey: first(primaryKey) === '!',
      reference,
      optional,
      name: first(name)
    });
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