"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'db',
    database: 'postgres',
    password: 'password',
    port: 5432,
});
exports.db = {
    query: (text, params) => {
        return pool.query(text, params);
    }
};
