"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "Abc123";
const createToken = (email, id, role) => {
    const payload = {
        id: id,
        email: email,
        role: role, //role can be either organisation or customer so that role based authorization can be acheived
    };
    const token = jsonwebtoken_1.default.sign(payload, secret);
    return token;
};
exports.createToken = createToken;
const ValidateToken = (token) => {
    try {
        const user = jsonwebtoken_1.default.verify(token, secret);
        return user;
    }
    catch (err) {
        return null;
    }
};
exports.ValidateToken = ValidateToken;
