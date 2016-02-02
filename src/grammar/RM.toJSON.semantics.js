export default {
  ListOf_some (element, separator, rest) {
    return [element.toJSON()].concat(rest.toJSON());
  },

  IContained (open, element, close) {
    return element.toJSON();
  },

  Model (name, databases) {
    return {
      name: name.toJSON(),
      databases: databases.toJSON()
    };
  },

  Database (name, tables) {
    return {
      name: name.toJSON(),
      tables: tables.toJSON()
    };
  },

  Table (name, attributes, dependencies) {
    return {
      name: name.toJSON(),
      attributes: attributes.toJSON(),
      dependencies: dependencies.toJSON()
    };
  },

  Attribute (name, type) {
    console.log('attribute');
    return {
      name: name.toJSON(),
      type: type.toJSON()
    };
  },

  Type (type) {
    return type.toJSON();
  },

  ValueList (valueList) {
    return {
      type: 'List',
      values: valueList.toJSON()
    };
  },

  ValueSet (valueSet) {
    return {
      type: 'Set',
      values: valueSet.toJSON()
    };
  },

  Dependency (glyph, name) {
    console.log('dependency');
    return name.toJSON();
  },

  name (first_character, additional_characters) {
    return this.interval.contents;
  }
};