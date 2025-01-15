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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPassedStudents = filterPassedStudents;
exports.getStudentNames = getStudentNames;
exports.sortStudentByGrade = sortStudentByGrade;
exports.studentAvgAge = studentAvgAge;
function filterPassedStudents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const StudentData = req.body;
        const passedStudents = yield StudentData.filter((data) => {
            return data.grade >= 50;
        });
        res.json({ passedStudents });
    });
}
function getStudentNames(req, res) {
    const StudentData = req.body;
    // let StudentNames:String[]=[]
    // for(let student of StudentData)
    // {
    //     StudentNames.push(student.name);
    // } 
    const studentNames = StudentData.map((student) => { return student.name; });
    res.json({ studentNames });
}
function sortStudentByGrade(req, res) {
    let studentData;
    studentData = req.body;
    studentData.sort((a, b) => a.grade - b.grade);
    res.json(studentData);
}
;
function studentAvgAge(req, res) {
    let studentData = req.body;
    const totalAge = studentData.reduce((sum, student) => {
        return sum + student.age;
    }, 0);
    res.send(`Average age of Student is:${totalAge / studentData.length}`);
}
