export default {
  ListOf_some (element, separator, rest) {
    return [element.toObject()].concat(rest.toObject());
  },

  IContained (open, element, close) {
    return element.toObject();
  },

  Model (name, databases) {
    return {
      name: name.toObject(),
      databases: databases.toObject()
    };
  },

  Database (name, tables) {
    return {
      name: name.toObject(),
      tables: tables.toObject()
    };
  },

  Table (name, attributes, dependencies) {
    return {
      name: name.toObject(),
      attributes: attributes.toObject(),
      dependencies: dependencies.toObject()
    };
  },

  Attribute (name, type) {
    console.log('attribute');
    return {
      name: name.toObject(),
      type: type.toObject()
    };
  },

  Type (type) {
    return type.toObject();
  },

  ValueList (valueList) {
    return {
      type: 'List',
      values: valueList.toObject()
    };
  },

  ValueSet (valueSet) {
    return {
      type: 'Set',
      values: valueSet.toObject()
    };
  },

  Dependency (glyph, name) {
    console.log('dependency');
    return name.toObject();
  },

  name (first_character, additional_characters) {
    return this.interval.contents;
  }
};