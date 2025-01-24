import { Request,Response } from "express";
import Customer from "../models/customerSchema";
import OrgCust from "../models/OrgCustSchema";
import Sow from "../models/sowSchema";
import PaymentPlan from "../models/paymentPlanSchema";
import crypto from "crypto";
import { sendMailPassword } from "../services/sendPasswordMail";
import Organisation from "../models/organisationSchema";
import { create } from "domain";

//add new customers

function generatePassword(){
    return crypto.randomBytes(4).toString('hex').slice(0,4);
}

export const addClients=async(req:Request,res:Response)=>{
    const {Cust_name,Cust_email,...otherDetails}=req.body;
    const OrgId=(req as any).user.id;    //get orgid of currently loged in org
    console.log(req.body);

    try{
    //check if the customer already exists in our db
    const isExistingCutomer= await Customer.findOne({
        where:{
            Cust_email:Cust_email,
        }
    });


    //check if the customer is already associated with the loged in org
    if(isExistingCutomer)
    {
        const customerId=isExistingCutomer.Cust_id;

        const isOrgCust=await OrgCust.findOne({
            where:{
                OrganisationId:OrgId,
                CustomerCustId:customerId,
            }
        });

        if(isOrgCust)
        {   
            const url=`http://localhost:3001/dashboard/createSow/${customerId}`;
            res.json(`Now you can create sow for customer ${customerId} click here ${url}`);        
        }else{
            const joinTable=await
            OrgCust.create({
               OrganisationId:OrgId,
               CustomerCustId:customerId,
           }); 
           const url=`http://localhost:3001/dashboard/createSow/${customerId}`;
           res.json(`Now you can create sow for customer ${customerId} click here ${url}`);   
        };
    }
    else
    {
        const randomPassword=generatePassword();
        const customer=await Customer.create({
            Cust_name,
            Cust_email,
            Cust_password:randomPassword,
            ...otherDetails,
        });
        const custId=customer.Cust_id;
        const joinTable=await
         OrgCust.create({
            OrganisationId:OrgId,
            CustomerCustId:custId,
        });

        const Org=await Organisation.findByPk(OrgId);
        const OrgName=Org?.dataValues.Orgname;

        console.log("JOin table done",joinTable);
        
        sendMailPassword(Cust_email,randomPassword,OrgName);
        const url=`http://localhost:3001/dashboard/createSow/${customer.Cust_id}`;
        res.json(`Now you can create sow for customer ${customer.Cust_id} click here ${url}`);  
    }

    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"Error",err});
        return;
    }

};


//sow creation

export const createSow=async(req:Request,res:Response)=>{
    const custId=parseInt(req.params.Cust_id);
    const {totalAmt,installments,months,projectName,sow_SignedOn}=req.body;
    const OrgId=(req as any).user.id;
    const orgCustData=await OrgCust.findAll({
        where:{
            OrganisationId:OrgId,
            CustomerCustId:custId,
        }
    });
    const orgCustId=orgCustData[0].id;
    const sowData=await Sow.create({
        OrgCustId:orgCustId,
        totalAmt,
        installments,
        months,
        sow_SignedOn,
        projectName
    });
    const url=`http://localhost:3001/dashboard/createSow/makePaymentPlan/${sowData.sowId}`
    res.json({message:`Now you can make payment plans for ${installments} installments clicke here ${url}`});
}; 



//payment plans;

export const makePaymentPlan=async(req:Request,res:Response)=>{
    const {particulars,amount,dueDate,status}=req.body;
    const sowId=req.params.SowId;
   
   try{ 
    const sowData=await Sow.findByPk(sowId);
    console.log(sowData?.dataValues.installments);
    const installments=sowData?.dataValues.installments;
    const countSowId=await PaymentPlan.count({where:{
        SowSowId:sowId
    }});
    console.log(countSowId);

    if(countSowId<installments)
    {
        const paymentPlanData=await PaymentPlan.create({
            particulars,
            amount,
            dueDate,
            status,
            SowSowId:sowId
            });
            res.json({message:`Payment plan created for ${dueDate}`});
    }
    else{
        res.json({message:`You can create only ${installments} payment plans`});
    }
    }
    catch(err)
    {
        console.log(err);
    }
};

export const getClient=async(req:Request,res:Response)=>{
    const OrgId=(req as any).user.id;
    const customers=await Customer.findAll();
    res.json(customers);
};

