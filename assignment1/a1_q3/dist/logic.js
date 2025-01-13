"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCheckLeapYear = void 0;
const handleCheckLeapYear = (req, res) => {
    const year = parseInt(req.params.year);
    let isLeapYear;
    isLeapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    const message = isLeapYear ? `<h1>The year ${year} is a leap year</h1>` : `<h1>The year ${year} is not a leap year</h1>`;
    return res.send(message);
};
exports.handleCheckLeapYear = handleCheckLeapYear;
