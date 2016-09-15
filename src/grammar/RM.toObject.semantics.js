import {join, first, prepend, single} from './util';

const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';

export default {
  ListOf_some:
    (element, separator, rest) =>
      prepend(element, rest),

  ListOf_none: () => undefined,

  CContained:
    (open, element, close) =>
      single(element),

  Model:
    (name, commonAttributes, schemas) =>
      join({name, commonAttributes: first(commonAttributes) || [], schemas}),

  Schema:
    (name, commonAttributes, tables) =>
      join({name, commonAttributes: first(commonAttributes) || [], tables}),

  Table:
    (name, attributes, dependencies) =>
      join({name, attributes: first(attributes), dependencies}),

  Dependency:
    (preArity, glyph, postArity, primaryKeyOrUnique, reference, optional, name) => {
      primaryKeyOrUnique = first(primaryKeyOrUnique) || {};
      return Object.assign(join({
        preArity: first(preArity) || '*',
        postArity: first(postArity) || '*',
        reference,
        optional: !!first(optional),
        name: first(name)
      }), primaryKeyOrUnique);
    },

  RegularAttribute:
    (primaryKeyOrUnique, name, optional, type, check) => {
      primaryKeyOrUnique = first(primaryKeyOrUnique) || {};
      type = first(type) || (primaryKeyOrUnique.primaryKey ? defaultPrimaryKeyType : defaultType);
      return Object.assign(join({
        name,
        optional: !!first(optional),
        type,
        check: first(check) // using first() here is a little bit of a hack; I want check to be undefined if there is none specified, without calling first() it is an empty array
      }), primaryKeyOrUnique);
    },

  PrimaryKey:
    primaryKey =>
      join({primaryKey: first(primaryKey) === '@'}),

  Unique:
    unique =>
      join({unique: first(unique) === '!'}),

  Optional:
    optional =>
      first(optional) === '?',

  Type: single,

  List:
    values =>
      join({type: 'List', values}),

  Set:
    values =>
      join({type: 'Set', values}),

  Constraint:
    (operator, value) =>
      join({operator, value}),

  Operator: single,

  CheckName:
    name =>
      join({check: 'Name', name}),

  CheckNumber:
    number =>
      join({check: 'Number', number}),

  SchemaTableName:
    (schema, dot, table) =>
      join({schema, table}),

  TableName:
    table =>
      join({table}),

  // Cannot use => syntax here as `this` must be preserved
  name (first_character, additional_characters) {
    return this.interval.contents;
  }
};