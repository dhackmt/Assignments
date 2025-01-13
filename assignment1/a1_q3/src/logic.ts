import {Request,Response} from "express";

export const  handleCheckLeapYear=(req:Request,res:Response):Response=>{
    const year=parseInt(req.params.year);
    
   let isLeapYear:boolean;
   isLeapYear=year%400===0 || (year%4===0 && year%100!==0);

   const message=isLeapYear? `<h1>The year ${year} is a leap year</h1>` :`<h1>The year ${year} is not a leap year</h1>` ;
   return res.send(message);      
}