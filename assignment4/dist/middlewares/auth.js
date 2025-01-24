"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "Abc123";
const createToken = (organisation) => {
    const payload = {
        id: organisation.id,
        email: organisation.email,
    };
    const token = jsonwebtoken_1.default.sign(payload, secret);
    return token;
};
exports.createToken = createToken;
