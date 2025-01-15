"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderID = getOrderID;
exports.getProductCode = getProductCode;
exports.findOrderBlock = findOrderBlock;
exports.filterOrders = filterOrders;
exports.increaseGrade = increaseGrade;
exports.lowestGrade = lowestGrade;
exports.countPassedStudents = countPassedStudents;
exports.getStudentObject = getStudentObject;
exports.findOrderByLineNo = findOrderByLineNo;
//get all order ID
function getOrderID(req, res) {
    const items = req.body.items;
    const OrderIds = items.map((item) => {
        console.log(item.orderID);
        return item.orderID;
    });
    res.json(OrderIds);
}
//get product code
function getProductCode(req, res) {
    const items = req.body.items;
    const ProductCodes = items.flatMap((item) => item.OrderBlocks.map((block) => block.ProductCode));
    res.json(ProductCodes);
}
//get orderid and product code of orders with productcode starting with #3
function findOrderBlock(req, res) {
    const items = req.body.items;
    const OrderBlocksWith3 = items.flatMap((item) => item.OrderBlocks.filter((block) => block.ProductCode.startsWith('#3')).map((block) => ({ orderid: item.orderID, productCode: block.ProductCode })));
    res.json(OrderBlocksWith3);
}
//filter orders with lineno >10
function filterOrders(req, res) {
    const items = req.body.items;
    const filteredOrders = items.filter((item) => item.OrderBlocks.some((block) => {
        block.lineNo = Array.isArray(block.lineNo) ? block.lineNo : [block.lineNo];
        return block.lineNo.some(no => no > 10);
    })).map((item) => item.orderID);
    res.json(filteredOrders);
}
// [
//     { "name": "Alice", "age": 20, "grade": 75 },
//     { "name": "Bob", "age": 22, "grade": 85 },
//     { "name": "Charlie", "age": 21, "grade": 60 },
//     { "name": "David", "age": 19, "grade": 45 },
//     { "name": "Eve", "age": 20, "grade": 90 }
//     ]
//increae grade of all  by 5
function increaseGrade(req, res) {
    const students = req.body;
    const newStudentData = students.map((student) => student.grade + 5);
    console.log(newStudentData);
    console.log(students);
}
//getStudent with lowest grade
function lowestGrade(req, res) {
    const students = req.body;
    const lowestGrade = students.reduce((lowest, student) => {
        return student.grade < lowest.grade ? student : lowest;
    }, students[0]);
    res.json(lowestGrade);
}
//count number of passed students
function countPassedStudents(req, res) {
    const students = req.body;
    const passed = students.filter((student) => student.grade > 50);
    res.send(`Passed Students are: ${passed.length}`);
}
//return a studnet object with name as key and age as value
function getStudentObject(req, res) {
    const students = req.body;
    const studnetObject = students.reduce((obj, student) => {
        obj[student.name] = student.age;
        return obj;
    }, {});
    res.json(studnetObject);
}
//{
//     "data": {
//         "items": [
//             {
//                 "orderID": "0000001211",
//                 "orderInvoiceNo": "1234567",
//                 "OrderBlocks": [
//                     {
//                         "lineNo": 1,
//                         "productCode": "001"
//                     },
//                     {
//                         "lineNo": 2,
//                         "productCode": "012"
//                     },
//                     {
//                         "lineNo": 3,
//                         "productCode": "013"
//                     }
//                 ]
//             }
//         ]
//     }
//  }
//find object with line number equal to 3
function findOrderByLineNo(req, res) {
    const body = req.body;
    console.log(body.data.items);
}
