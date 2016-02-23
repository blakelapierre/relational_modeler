import {join, first} from './util';

import RMToObjectSemantics from './RM.toObject.semantics';

const defaultType = 'text',
      defaultPrimaryKeyType = 'bigserial';

export default Object.assign({
  Numeric: (numeric, parameters) =>
    parameters.toObject()[0] || {type: 'Numeric'},

  NumericParameters: (precision, optionalScale) =>
    join({type: 'Numeric', precision, scale: first(optionalScale)}),

  OptionalScale: (comma,  scale) =>
    scale,

  number: digits =>
    parseInt(digits.toObject().join(''), 10),
}, RMToObjectSemantics);