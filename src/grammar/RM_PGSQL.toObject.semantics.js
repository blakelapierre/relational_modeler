const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';


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
    primaryKey = primaryKey.toObject()[0] === '!';
    type = type.toObject()[0] || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return join({name, primaryKey, optional: optional.toObject()[0] === '?', type});
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

  Numeric (numeric, parameters) {
    return parameters.toObject()[0] || {type: 'Numeric'};
  },

  NumericParameters (precision, optionalScale) {
    return join({type: 'Numeric', precision, scale: optionalScale.toObject()[0]});
  },

  OptionalScale (comma,  scale) {
    return scale;
  },

  number (digits) {
    return parseInt(digits.toObject().join(''), 10);
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