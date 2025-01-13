"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logic_js_1 = require("./logic.js");
const app = (0, express_1.default)();
const port = 8000;
app.get("/:year", logic_js_1.handleCheckLeapYear);
app.listen(port, () => {
    console.log(`server running on ${port}`);
});
