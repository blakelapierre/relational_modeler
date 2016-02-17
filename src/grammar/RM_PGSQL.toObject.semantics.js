const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';


export default {
  ListOf_some: (element, separator, rest) =>
    [element.toObject()].concat(rest.toObject()),

  IContained: (open, element, close) =>
    element.toObject(),

  Model: (name, commonAttributes, schemas) =>
    join({name, commonAttributes: commonAttributes.toObject()[0] || [], schemas}),

  Schema: (name, commonAttributes, tables) =>
    join({name, commonAttributes: commonAttributes.toObject()[0] || [], tables}),

  Table: (name, attributes, dependencies) =>
    join({name, attributes: attributes.toObject()[0], dependencies}),

  Attribute: (primaryKey, name, optional, type) => {
    primaryKey = primaryKey.toObject()[0] === '!';
    type = type.toObject()[0] || (primaryKey ? defaultPrimaryKeyType : defaultType);
    return join({name, primaryKey, optional: optional.toObject()[0] === '?', type});
  },

  Type: type =>
    type.toObject(),

  List: values =>
    join({type: 'List', values}),

  Set: values =>
    join({type: 'Set', values}),

  Numeric: (numeric, parameters) =>
    parameters.toObject()[0] || {type: 'Numeric'},

  NumericParameters: (precision, optionalScale) =>
    join({type: 'Numeric', precision, scale: optionalScale.toObject()[0]}),

  OptionalScale: (comma,  scale) =>
    scale,

  number: digits =>
    parseInt(digits.toObject().join(''), 10),

  Dependency: (preArity, glyph, postArity, reference) =>
    join({
      preArity: $ => $(preArity)[0] || 1,
      postArity: $ => $(postArity)[0] || 1,
      reference
    }),

  SchemaTableName: (schema, dot, table) =>
    join({schema, table}),

  TableName: table =>
    join({table}),

  name (first_character, additional_characters) {
    return this.interval.contents; // can't use lambda/fat-arrow due to `this`
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