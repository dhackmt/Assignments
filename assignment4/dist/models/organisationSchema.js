"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgConfig_1 = __importDefault(require("../database/pgConfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
;
class Organisation extends sequelize_1.Model {
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            const salt = yield bcrypt_1.default.genSalt(saltRounds);
            return bcrypt_1.default.hash(password, salt);
        });
    }
    //check if password entered by user matches with the one in database
    static comparePassword(enteredPassword, storedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(enteredPassword, storedPassword);
        });
    }
}
Organisation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Orgname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    GSTNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    PAN_No: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: pgConfig_1.default,
    tableName: "organisations",
    timestamps: true,
});
exports.default = Organisation;
