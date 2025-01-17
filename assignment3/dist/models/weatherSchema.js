"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
const sequelize_1 = require("sequelize");
class Weather extends sequelize_1.Model {
}
exports.Weather = Weather;
Weather.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    weather: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    longitude: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }, latitude: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: pgConfig_1.default,
    tableName: "weather",
    timestamps: true,
});
