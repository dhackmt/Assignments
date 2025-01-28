import { Request,Response } from "express";
import Organisation from "../models/organisationSchema";
import { createToken } from "../services/auth";


export const createUser=async(req:Request,res:Response)=>{
    //fetch data from payload
    const {Orgname,password,...otherDetails}=req.body;

    const hashedPassword=await Organisation.hashPassword(password);

    //insert data into database
    const organisation=await Organisation.create({Orgname,password:hashedPassword,...otherDetails});


    const token=createToken(organisation.email,organisation.id,"Organisation");
    res.json(token);
};

export const loginUser=async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    const users=await Organisation.findAll({
        where:{
            email:email,
        }
    });

    //check if user exists
    if(users.length==0)
    {
        res.json({message:"No such User"});
        return;
    }
    const user=users[0];

    const ValidUser=await Organisation.comparePassword(password,user.password);
    
    if(!ValidUser)
    {
        res.json({message:"Incorrect password"});
        return;
    }
    
    const token=createToken(user.email,user.id,"Organisation");
    res.json({message:"Login SUccessful",token});
    
}