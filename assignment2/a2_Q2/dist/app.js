"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logic_1 = require("./logic");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.post("/getOrderID", logic_1.getOrderID);
app.post("/getProductCode", logic_1.getProductCode);
app.post("/findOrderBlock", logic_1.findOrderBlock);
app.post("/filterOrders", logic_1.filterOrders);
app.post("/increaseGrade", logic_1.increaseGrade);
app.post("/lowestGrade", logic_1.lowestGrade);
app.post("/countPassedStudents", logic_1.countPassedStudents);
app.post("/getStudentObject", logic_1.getStudentObject);
app.post("/findOrderByLineNo", logic_1.findOrderByLineNo);
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
