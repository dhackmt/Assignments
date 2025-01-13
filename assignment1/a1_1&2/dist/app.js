"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logic_js_1 = require("./logic.js");
const app = (0, express_1.default)();
const port = 8000;
app.get("/split/:string1", logic_js_1.handleSplitString);
//using params
app.get("/split/:string1/:string2", logic_js_1.handleConcatString);
//using query paramaters
app.get("/split", logic_js_1.handleQueryParamters);
app.listen(port, () => {
    console.log(`server running on ${port}`);
});
