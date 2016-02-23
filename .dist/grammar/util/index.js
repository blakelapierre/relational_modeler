"use strict";
function join(obj) {
  for (var key in obj) {
    var value = obj[key];
    if (value === undefined)
      continue;
    else if (typeof value === 'function')
      obj[key] = value(function(o) {
        return o.toObject();
      });
    else if (value.toObject)
      obj[key] = value.toObject();
  }
  return obj;
}
function first(obj) {
  return obj.toObject()[0];
}
Object.defineProperties(module.exports, {
  join: {get: function() {
      return join;
    }},
  first: {get: function() {
      return first;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=index.js.map
