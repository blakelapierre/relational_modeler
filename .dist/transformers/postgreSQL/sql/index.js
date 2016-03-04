"use strict";
var createSchema = function(name) {
  return ("CREATE SCHEMA " + name + ";");
};
var createTable = function(name, columns) {
  return ("CREATE TABLE " + name + " (" + columns + ");");
};
var createType = function(name, values) {
  return ("CREATE TYPE " + name + " (" + values.map(function(value) {
    return ("'" + value + "'");
  }).join(', ') + ")");
};
Object.defineProperties(module.exports, {
  createSchema: {get: function() {
      return createSchema;
    }},
  createTable: {get: function() {
      return createTable;
    }},
  createType: {get: function() {
      return createType;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=index.js.map
