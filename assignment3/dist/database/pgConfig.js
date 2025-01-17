"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    username: "postgres",
    password: "root",
    port: 5432,
    dialect: 'postgres',
    host: 'localhost',
    database: "weatherDatabase"
});
exports.default = sequelize;
