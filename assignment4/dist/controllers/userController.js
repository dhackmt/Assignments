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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const auth_1 = require("../services/auth");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //fetch data from payload
    const _a = req.body, { Orgname, password } = _a, otherDetails = __rest(_a, ["Orgname", "password"]);
    const hashedPassword = yield organisationSchema_1.default.hashPassword(password);
    //insert data into database
    const organisation = yield organisationSchema_1.default.create(Object.assign({ Orgname, password: hashedPassword }, otherDetails));
    const token = (0, auth_1.createToken)(organisation.email, organisation.id, "Organisation");
    res.json(token);
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const users = yield organisationSchema_1.default.findAll({
        where: {
            email: email,
        }
    });
    //check if user exists
    if (users.length == 0) {
        res.json({ message: "No such User" });
        return;
    }
    const user = users[0];
    const ValidUser = yield organisationSchema_1.default.comparePassword(password, user.password);
    if (!ValidUser) {
        res.json({ message: "Incorrect password" });
        return;
    }
    const token = (0, auth_1.createToken)(user.email, user.id, "Organisation");
    res.json({ message: "Login SUccessful", token });
});
exports.loginUser = loginUser;
