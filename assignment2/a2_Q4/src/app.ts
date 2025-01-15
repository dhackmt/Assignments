import express  from "express";
import {filterPassedStudents,getStudentNames, sortStudentByGrade, studentAvgAge} from "./logic";

const app=express();
const PORT=8000;

app.use(express.json());

app.post("/filterPassesStudents",filterPassedStudents)

app.post("/getStudentnames",getStudentNames)

app.post("/sortStudentByGrade",sortStudentByGrade)

app.post("/studentAvgAge",studentAvgAge)

app.listen(PORT,()=>{
    console.log(`Server running ${PORT}`);
})

    