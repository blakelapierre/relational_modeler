import {join, first} from './util';

const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';

export default {
  ListOf_some (element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  CContained (open, element, close) {
    return element.toObject();
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

  Attribute (primaryKey, name, optional, type) {
    primaryKey = first(primaryKey) === '!';
    type = first(type) || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return join({name, primaryKey, optional: first(optional) === '?', type});
  },

  Type (type) {
    return type.toObject();
  },

  List (values) {
    return join({type: 'List', values});
  },

  Set (values) {
    return join({type: 'Set', values});
  },

  Dependency (preArity, glyph, postArity, primaryKey, reference, optional, name) {
    return join({
      preArity: first(preArity) || '*',
      postArity: first(postArity) || '*',
      primaryKey: first(primaryKey) === '!',
      reference,
      optional,
      name: (name || '').length > 0 ? name : undefined
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