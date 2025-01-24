import Customer from "../models/customerSchema";
import { Request,Response } from "express";
import { createToken } from "../services/auth";
import OrgCust from "../models/OrgCustSchema";
import Sow from "../models/sowSchema";
import "../models/association";
import PaymentPlan from "../models/paymentPlanSchema";


export const customerLogin=async(req:Request,res:Response)=>{
    const {Cust_email,Cust_password}=req.body;
    console.log(Cust_email,Cust_password);
    const users=await Customer.findAll({
        where:{
            Cust_email:Cust_email,
        }
    });
    if(users.length==0)
    {
        res.json({message:"No such User"});
        return;
    }
    const user=users[0];
    const ValidUser=Cust_password===user.Cust_password;
    if(!ValidUser)
    {
        res.json({message:"Incorrect password"});
        return;
    }
    const token=createToken(user.Cust_email,user.Cust_id,"Customer");
    res.json({message:"Login SUccessful",token});
    
}

export const customerPersonalData=async(req:Request,res:Response)=>{
    const customerID=(req as any).user.id;
  const customerData=await Customer.findByPk(customerID);
  const response = `
  <table border="1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${customerData?.dataValues.Cust_name}</td>
        <td>${customerData?.dataValues.Cust_email}</td>
        <td>${customerData?.dataValues.Cust_phone}</td>
        <td>${customerData?.dataValues.Cust_address}</td>
      </tr>
    </tbody>
  </table>
`;


  res.send(response);
}

export const getSowData=async(req:Request,res:Response)=>{
    const customerId=(req as any).user.id;
    console.log(customerId);
    const sowData=await Sow.findAll({
        include:[{
            model:OrgCust,
            where:{
                CustomerCustId:customerId,
            }
        }]
    });
    res.json(sowData);
}

export const getPaymentPlans=async(req:Request,res:Response)=>{
    const customerId=(req as any).user.id;
    const paymentPlans=await PaymentPlan.findAll({
        attributes:["particulars","amount","dueDate","status"],
      include:[{
        model:Sow,
        attributes:["projectName"],
        include:[{
            model:OrgCust,
            where:{
                CustomerCustId:customerId,
            },
            attributes:[],        
        }]
      }]  
    });

    res.json(paymentPlans);
}