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

  Attribute (name, type) {
    return join({name, type});
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

  Dependency (glyph, reference) {
    return reference.toObject();
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
  for (let key in obj) if (obj[key].toObject) obj[key] = obj[key].toObject();
  return obj;
}