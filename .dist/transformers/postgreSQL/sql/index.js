'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createDatabase = exports.createDatabase = function createDatabase(name) {
  return 'CREATE DATABASE "' + name + '";\n\\c "' + name + '"';
};

var createSchema = exports.createSchema = function createSchema(name) {
  return 'CREATE SCHEMA "' + name + '";';
};

var createTable = exports.createTable = function createTable(name, columns, constraints) {
  return 'CREATE TABLE ' + name + ' (' + [columns].concat(constraints || []).join(', ') + ');';
};

var createType = exports.createType = function createType(name, values) {
  return 'CREATE TYPE ' + name + ' (' + values.map(function (value) {
    return '\'' + value + '\'';
  }).join(', ') + ')';
};