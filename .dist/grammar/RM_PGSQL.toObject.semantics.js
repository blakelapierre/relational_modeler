'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _RMToObject = require('./RM.toObject.semantics');

var _RMToObject2 = _interopRequireDefault(_RMToObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Object.assign({

  Numeric: function Numeric(numeric, parameters) {
    return parameters.toObject()[0] || { type: 'Numeric' };
  },

  NumericParameters: function NumericParameters(precision, optionalScale) {
    return (0, _util.join)({ type: 'Numeric', precision: precision, scale: (0, _util.first)(optionalScale) });
  },

  OptionalScale: function OptionalScale(comma, scale) {
    return scale;
  },

  number: function number(digits) {
    return parseInt(digits.toObject().join(''), 10);
  },

  VarChar: function VarChar(varchar, length) {
    return (0, _util.join)({ type: 'VarChar', length: length });
  }

}, _RMToObject2.default);