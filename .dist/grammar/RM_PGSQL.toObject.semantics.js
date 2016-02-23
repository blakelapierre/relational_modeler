"use strict";
var $__util__,
    $__RM_46_toObject_46_semantics__;
var $__0 = ($__util__ = require("./util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}),
    join = $__0.join,
    first = $__0.first;
var RMToObjectSemantics = ($__RM_46_toObject_46_semantics__ = require("./RM.toObject.semantics"), $__RM_46_toObject_46_semantics__ && $__RM_46_toObject_46_semantics__.__esModule && $__RM_46_toObject_46_semantics__ || {default: $__RM_46_toObject_46_semantics__}).default;
var $__default = Object.assign({
  Numeric: function(numeric, parameters) {
    return parameters.toObject()[0] || {type: 'Numeric'};
  },
  NumericParameters: function(precision, optionalScale) {
    return join({
      type: 'Numeric',
      precision: precision,
      scale: first(optionalScale)
    });
  },
  OptionalScale: function(comma, scale) {
    return scale;
  },
  number: function(digits) {
    return parseInt(digits.toObject().join(''), 10);
  }
}, RMToObjectSemantics);
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=RM_PGSQL.toObject.semantics.js.map
