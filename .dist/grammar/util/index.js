'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.join = join;
exports.first = first;
function join(obj) {
  for (var key in obj) {
    var value = obj[key];
    if (value === undefined) continue;else if (typeof value === 'function') obj[key] = value(function (o) {
      return o.toObject();
    });else if (value.toObject) obj[key] = value.toObject();
  }
  return obj;
}

function first(obj) {
  return obj.toObject()[0];
}