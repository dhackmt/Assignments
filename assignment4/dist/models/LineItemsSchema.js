"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
const sequelize_1 = require("sequelize");
class LineItems extends sequelize_1.Model {
}
LineItems.init({
    lineId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    particulars: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: pgConfig_1.default,
    tableName: "lineItem",
    timestamps: true,
});
exports.default = LineItems;
