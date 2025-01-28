"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
const sequelize_1 = require("sequelize");
class invoice extends sequelize_1.Model {
}
invoice.init({
    invoiceId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    organisationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    receivedOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize: pgConfig_1.default,
    tableName: "invoice",
    timestamps: true,
});
exports.default = invoice;
