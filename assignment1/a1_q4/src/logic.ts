import {Request,Response} from "express";

export const handleCheckMember=(req:Request,res:Response):Response=>{
    const code=Number(req.query.code);   

    let binary=code.toString(2).padStart(5,'0');
   
   const actios=["wink","double blink","close your eyes","jump","reverse"];

   let result=[];

   for(let i=0;i<=5;i++)
   {
        if(binary[4-i]==='1')
        {
            result.push(actios[i]);
        }
   }

   if(binary[0]==='1')
   {
        result.reverse();
   }

   return res.send(result);
}