export const createSchema = name => `CREATE SCHEMA ${name};`;

export const createTable = (name, columns) => `CREATE TABLE ${name} (${columns});`;

export const createType = (name, values) => `CREATE TYPE ${name} (${values.map(value => `'${value}'`).join(',')})`;