import { Request,Response } from "express";
import Customer from "../models/customerSchema";
import OrgCust from "../models/OrgCustSchema";
import Sow from "../models/sowSchema";
import PaymentPlan from "../models/paymentPlanSchema";
import crypto from "crypto";
import { sendMailPassword } from "../services/sendPasswordMail";
import Organisation from "../models/organisationSchema";
import dotenv from "dotenv";
import LineItems from "../models/LineItemsSchema";
dotenv.config();



const PORT=process.env.PORT;


//this function is to generate random passowrd for customer login when organisation add them as their client, customer get this password via mail
function generatePassword(){
    return crypto.randomBytes(4).toString('hex').slice(0,4);
}


//adding customers

export const addClients=async(req:Request,res:Response)=>{
    const {Cust_name,Cust_email,...otherDetails}=req.body;
    const OrgId=(req as any).user.id;    //get orgid of currently loged in org

    try{
    //check if the customer already exists in our db, if yes than no new record for that customer will be created
    const isExistingCutomer= await Customer.findOne({
        where:{
            Cust_email:Cust_email,
        }
    });


    //check if the customer is already associated with the loged in org, if yes than directly sow can be created or else association is defined
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
           const url=`http://localhost:${PORT}/dashboard/createSow/${customerId}`;
           res.json(`Now you can create sow for customer ${customerId} click here ${url}`);   
        };
    }
    else
    {
        //generating password for newly added customer
        const randomPassword=generatePassword();
    

        // adding customer
        const customer=await Customer.create({
            Cust_name,
            Cust_email,
            Cust_password:randomPassword,
            ...otherDetails,
        });


        const custId=customer.Cust_id;
       
        //adding orgId and customerID in their join table because org and customer has many to many relationship
        const joinTable=await
         OrgCust.create({
            OrganisationId:OrgId,
            CustomerCustId:custId,
        });

        //fetching organisation name
        const Org=await Organisation.findByPk(OrgId);

        const OrgName=Org?.dataValues.Orgname;

        console.log("JOin table done",joinTable);
        

        //sending password to newly added customer via mail
        sendMailPassword(Cust_email,randomPassword,OrgName);

        //adds customer id as params so that sow can be created for that particular customer only

        const url=`http://localhost:${PORT}/dashboard/createSow/${customer.Cust_id}`;
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
    try{

        //fetching customer id from params(passed at the time of sow creation) so that sow can be created for that particular customer only
    const custId=parseInt(req.params.Cust_id);

    const {totalAmt,installments,months,projectName,sow_SignedOn}=req.body;
    
    const OrgId=(req as any).user.id; 
    

    //getting OrgCUst id sow that sow can be created for that particular organisation and customer only, this id is passed in sow table as foreign key to create association
    const orgCustData=await OrgCust.findAll({
        where:{
            OrganisationId:OrgId,
            CustomerCustId:custId,
        }
    });

    const orgCustId=orgCustData[0].id;
    
    //creating sow
    const sowData=await Sow.create({
        OrgCustId:orgCustId,
        totalAmt,
        installments,
        months,
        sow_SignedOn,
        projectName
    });


    //passing sowId here so that payment plan can be created for that particluar sow
    const url=`http://localhost:${PORT}/dashboard/createSow/makePaymentPlan/${sowData.sowId}`

    res.json({message:`Now you can make payment plans for ${installments} installments clicke here ${url}`});}
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"Error",err});
        return;
    }
}; 



//payment plans;

export const makePaymentPlan=async(req:Request,res:Response)=>{
    const {particulars,amount,dueDate,status}=req.body;
    
    const sowId=req.params.SowId;
    
    const orgId=(req as any).user.id;

   try{ 
    const sowData=await Sow.findByPk(sowId);

    //installments
 //number of installments= number of payment plans
    const installments=sowData?.dataValues.installments;

//orgCustID fetching this so that we can find exact customer
    const orgCustId=sowData?.dataValues.OrgCustId;
 
    const OrgCustData=await OrgCust.findByPk(orgCustId);

    //customerId

    const customerId=OrgCustData?.dataValues.CustomerCustId;
    
    //fetching count of each sowID to see how many more payment plans are left to create
    
    const countSowId=await PaymentPlan.count({where:{
        SowSowId:sowId
    }});
    

    //checkinh if organisation is creating payment plans more than the number of installments defined
  

    if(countSowId<installments)
    {
        const paymentPlanData=await PaymentPlan.create({
            particulars,
            amount,
            dueDate,
            status,
            customerId:customerId,
            OrganisationId:orgId,
            pendingAmount:amount,
            SowSowId:sowId
            });


            const planId= paymentPlanData.dataValues.planId;
            console.log(planId);
            const url=`http://localhost:${PORT}/dashboard/createSow/lineItem/${planId}`
            res.json({message:`Payment plan created for ${dueDate} now you can proceed with lineItems: ${url}`});

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



//creating LineItems to give briefing of each payment plan


export const createLineItems=async(req:Request,res:Response)=>{

   const {particulars,amount}=req.body;
   const planId=parseInt(req.params.id);

   const LineItem=await LineItems.create({
    amount:amount,
    particulars:particulars,
    PaymentPlanPlanId:planId,
   });
   res.json(LineItem);
};


//fetching client details of each org

export const getClient=async(req:Request,res:Response)=>{
    const OrgId=(req as any).user.id;
    const customers=await Customer.findAll({
        attributes:["Cust_email","Cust_name"],
        include:[{
            model:OrgCust,
                where:{
                    OrganisationId:OrgId
                }
        }]
    });
    res.json(customers);
};

