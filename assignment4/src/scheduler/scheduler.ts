import cron from "node-cron";
import { Request,Response } from "express";

const checkPaymentPlans=async()=>{
    const today=new Date();
    const formatedToday=today.toISOString().split('T')[0];

    
}
