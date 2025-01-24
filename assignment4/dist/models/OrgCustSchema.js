"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
const sequelize_1 = require("sequelize");
class OrgCust extends sequelize_1.Model {
}
;
OrgCust.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
}, {
    sequelize: pgConfig_1.default,
    tableName: "OrgCust",
    timestamps: true,
});
exports.default = OrgCust;
