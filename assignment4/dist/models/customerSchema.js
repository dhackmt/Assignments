"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
class Customer extends sequelize_1.Model {
}
Customer.init({
    Cust_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Cust_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Cust_email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Cust_password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Cust_phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Cust_address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: pgConfig_1.default,
    tableName: "customers",
    timestamps: true,
    modelName: 'Customer'
});
exports.default = Customer;
