const defaultType = 'text';

export default {
  ListOf_some (element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  IContained (open, element, close) {
    return element.toObject();
  },

  Model (name, commonAttributes, schemas) {
    return join({name, commonAttributes: commonAttributes.toObject()[0] || [], schemas});
  },

  Schema (name, commonAttributes, tables) {
    return join({name, commonAttributes: commonAttributes.toObject()[0] || [], tables});
  },

  Table (name, attributes, dependencies) {
    return join({name, attributes: attributes.toObject()[0], dependencies});
  },

  Attribute (primaryKey, name, optional, type) {
    return join({name, primaryKey: primaryKey.toObject()[0] === '!', optional: optional.toObject()[0] === '?', type: type.toObject()[0] || defaultType});
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

  Dependency (preArity, glyph, postArity, reference) {
    return join({
      preArity: $ => $(preArity)[0] || 1,
      postArity: $ => $(postArity)[0] || 1,
      reference
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

function join(obj) {
  for (let key in obj) {
    const value = obj[key];
    if (value === undefined) continue;
    else if (typeof value === 'function') obj[key] = value(o => o.toObject());
    else if (value.toObject) obj[key] = value.toObject();
  }
  return obj;
}