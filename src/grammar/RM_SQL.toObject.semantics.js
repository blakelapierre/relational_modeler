export default {
  ListOf_some (element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  IContained (open, element, close) {
    return element.toObject();
  },

  Model (name, schemas) {
    return join({name, schemas});
  },

  Schema (name, tables) {
    return join({name, tables});
  },

  Table (name, attributes, dependencies) {
    return join({name, attributes: attributes.toObject()[0], dependencies});
  },

  Attribute (name, optional, type) {
    return join({name, optional: optional.toObject()[0] === '?', type});
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
    if (typeof obj[key] === 'function') obj[key] = obj[key](o => o.toObject());
    else if (obj[key].toObject) obj[key] = obj[key].toObject();
  }
  return obj;
}