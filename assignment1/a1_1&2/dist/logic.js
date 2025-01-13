"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQueryParamters = exports.handleConcatString = exports.handleSplitString = void 0;
const handleSplitString = (req, res) => {
    const { string1 } = req.params;
    const revisedString = string1.split("_").join(" ");
    return res.json({ revisedString });
};
exports.handleSplitString = handleSplitString;
//params
const handleConcatString = (req, res) => {
    const { string1, string2 } = req.params;
    const revisedString = string1 + string2;
    return res.json({ revisedString });
};
exports.handleConcatString = handleConcatString;
//query
const handleQueryParamters = (req, res) => {
    const string1 = req.query.string1 || "";
    const string2 = req.query.string2 || "";
    const revisedString = string1 + string2;
    return res.json({ revisedString });
};
exports.handleQueryParamters = handleQueryParamters;
