"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    database: "TestOrder",
    password: "root",
    port: 5432,
    host: "localhost",
});
exports.default = pool;
