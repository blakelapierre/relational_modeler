export const createDatabase = name => `CREATE DATABASE "${name}";\n\\c "${name}"`;

export const createSchema = name => `CREATE SCHEMA "${name}";`;

export const createTable = (name, columns, constraints) => `CREATE TABLE ${name} (${[columns].concat(constraints || []).join(', ')});`;

export const createType = (name, values) => `CREATE TYPE ${name} AS ENUM (${values.map(value => `'${value}'`).join(', ')});`;