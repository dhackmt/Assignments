"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    username: 'postgres',
    host: 'localhost',
    database: 'industry',
    password: "root",
    dialect: "postgres",
});
exports.default = sequelize;
