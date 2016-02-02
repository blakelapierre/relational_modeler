export default {
  ListOf_some (element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  IContained (open, element, close) {
    return element.toObject();
  },

  Model (name, databases) {
    return join({name, databases});
  },

  Database (name, tables) {
    return join({name, tables});
  },

  Table (name, attributes, dependencies) {
    return join({name, attributes, dependencies});
  },

  Attribute (name, type) {
    return join({name, type});
  },

  Type (type) {
    return type.toObject();
  },

  ValueList (values) {
    return join({type: 'List', values});
  },

  ValueSet (values) {
    return join({type: 'Set', values});
  },

  Dependency (glyph, name) {
    return name.toObject();
  },

  name (first_character, additional_characters) {
    return this.interval.contents;
  }
};

function join(obj) {
  for (let key in obj) if (obj[key].toObject) obj[key] = obj[key].toObject();
  return obj;
}