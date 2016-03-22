export const createSchema = name => `CREATE SCHEMA ${name};`;

export const createTable = (name, columns, constraints) => `CREATE TABLE ${name} (${[columns].concat(constraints || []).join(',')});`;

export const createType = (name, values) => `CREATE TYPE ${name} (${values.map(value => `'${value}'`).join(', ')})`;