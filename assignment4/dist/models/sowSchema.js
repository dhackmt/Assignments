"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
const sequelize_1 = require("sequelize");
class Sow extends sequelize_1.Model {
}
Sow.init({
    sowId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    totalAmt: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    installments: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    months: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    sow_SignedOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    projectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: pgConfig_1.default,
    tableName: "sow",
    timestamps: true,
});
exports.default = Sow;
