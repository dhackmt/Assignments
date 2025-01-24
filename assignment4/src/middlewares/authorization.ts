    import { NextFunction, Request,Response } from "express";
    import { ValidateToken } from "../services/auth";

    export const isAuthorized=(role:string)=>
        (req:Request,res:Response,next:NextFunction)=>{
    const UserData=req.headers['authorization'];
    if(!UserData)
    {
        res.json({message:"You cannot access this page"});
        return;
    }
    const token=UserData.split(" ")[1];
    const user=ValidateToken(token);
    if(!user)
        {
            res.json({message:"You cannot access this page"});  
            return;
        } 

       if(!role.includes(user.role))
       {
        res.json({message:"You cannot access this page"});
        return;
       }
        
        // Proceed if the user is authorized
        (req as any).user = { id: user.id, role: user.role };
        next();
    }

