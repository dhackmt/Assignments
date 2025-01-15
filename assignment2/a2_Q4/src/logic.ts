import { Request,Response } from "express";
import { Student } from "./types/type";

export async function filterPassedStudents(req:Request,res:Response){
    const StudentData=req.body;
    const passedStudents=await StudentData.filter((data:Student)=>{
        return data.grade>=50;
    })
    res.json({passedStudents})
}

export  function getStudentNames(req:Request,res:Response){
    const StudentData=req.body;
    const studentNames=StudentData.map((student:Student)=>{return student.name})
    res.json({studentNames})
}

export function sortStudentByGrade(req:Request,res:Response){
   let studentData:Student[];
   studentData=req.body;
   studentData.sort((a,b)=>a.grade-b.grade);
   res.json(studentData);
};

export function studentAvgAge(req:Request,res:Response){
    let studentData:Student[]=req.body;
    const totalAge=studentData.reduce((sum,student)=>{
        return sum +student.age;
    },0);
    res.send(`Average age of Student is:${totalAge/studentData.length}`);
}