"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logic_1 = require("./logic");
const app = (0, express_1.default)();
const PORT = 8000;
app.use(express_1.default.json());
app.post("/filterPassesStudents", logic_1.filterPassedStudents);
app.post("/getStudentnames", logic_1.getStudentNames);
app.post("/sortStudentByGrade", logic_1.sortStudentByGrade);
app.post("/studentAvgAge", logic_1.studentAvgAge);
app.listen(PORT, () => {
    console.log(`Server running ${PORT}`);
});
