import Customer from "../models/customerSchema";
import { Request,Response } from "express";
import { createToken } from "../services/auth";
import OrgCust from "../models/OrgCustSchema";
import Sow from "../models/sowSchema";
import "../models/association";
import PaymentPlan from "../models/paymentPlanSchema";
import invoice from "../models/invoiceSchema";
import Organisation from "../models/organisationSchema";
import { sendInvoice } from "../services/sendInvoice";
import dotenv from "dotenv";
dotenv.config();



const PORT=process.env.PORT;


//login 

export const customerLogin=async(req:Request,res:Response)=>{
    const {Cust_email,Cust_password}=req.body;

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

//Checks if entered password matches with password in database
    const ValidUser=Cust_password===user.Cust_password;

    if(!ValidUser)
    {
        res.json({message:"Incorrect password"});
        return;
    }

    const token=createToken(user.Cust_email,user.Cust_id,"Customer");
    res.json({message:"Login SUccessful",token});
    
}

//fetching personal details

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


export const getAllOrganisations=async(req:Request,res:Response)=>{

  const customerId=(req as any).user.id;

  //geting OrgId that matched the customer id in their joint table(org and cust has many to many association through OrgCust table)

  const OrgCustdata=await OrgCust.findAll({
    attributes:["id","OrganisationId"],
    where:{
      CustomerCustId:customerId,
    },
  });
  
  
  //Extracting only the OrgId from the OrgCust(join table of org and customer) data
  const OrgId=OrgCustdata.map(org=>org.dataValues.OrganisationId);
  
  //Extracting only OrgCust id from the OrgCust data(join table of org and customer)
  const OrgCustId=OrgCustdata.map(orgCust=>orgCust.id);

  //fetching Orgname baed on their ids;

  const OrgData=await Promise.all(OrgId.map(async(id)=>{
    return await Organisation.findOne({
      attributes:["Orgname"],
      where:{
        id:id
      }
    });
  }))
 
 //OrgData is array of all the OrgNames associated with that particular customer
  
 const result=OrgData.map((org,index)=>{
  return{
//showing user each orgname he/she is associated with
    orgName:org,
//this url contains OrgCust id(join table between org and cust) to view sow of only that organisation and customer
    sowUrl:`http://localhost:${PORT}/customer/sowData/${OrgCustId[index]}`,
  }
 });

  res.json(result);
}



export const getSowData=async(req:Request,res:Response)=>{

  //extracting orgCust id so that sow can be fetched for that particular org and cust only

  const orgCustId=parseInt(req.params.id);
  
  const sowData=await Sow.findAll({
    attributes:["sowId","totalAmt","installments","months","sow_SignedOn","projectName"],
    where:{
      OrgCustId:orgCustId,
    },
  });

  const response=sowData.map(sow=>{
    const result={
      totalAmount:sow.dataValues.totalAmt,
      installments:sow.dataValues.installments,
      months:sow.dataValues.months,
      sowSignedOn:sow.dataValues.sow_SignedOn,
      projectName:sow.dataValues.projectName,
  
      //this url contains the sow id so that particular payment plan can be viewed
      url:`http://localhost:${PORT}/customer/paymentPlan/${sow.sowId}`,
    }
    return result;
  })
  res.json(response);
}

//payment plan

export const getPaymentPlans=async(req:Request,res:Response)=>{

  const sowId=parseInt(req.params.id);

  const paymentData=await PaymentPlan.findAll({
  
    //fetching payment plans or that partuiclar sow id only which was passed from url as params

  attributes:["planId","particulars","amount","dueDate","status","pendingAmount"],
  where:{
    SowSowId:sowId,
  },
});

const response=paymentData.map(data=>{
  const result={
    particulars:data.particulars,
    amount:data.amount,
    dueDate:data.dueDate,
    status:data.status,
    pendingAMount:data.pendingAmount,

    //on this url using planID ,that particular plan payment can be made
    url:`http://localhost:${PORT}/customer/makePayment/${data.planId}`
  };
  return result;  
});
res.json(response);

}

export const makePayment=async(req:Request,res:Response)=>{
  const planId=parseInt(req.params.id);
  const {amount}=req.body;
  const customerId=(req as any).user.id;

  try{

  const paymentData=await PaymentPlan.findOne({
    where:{
      planId:planId,
    }
  });

  
  if(paymentData)
  {

    const amountDue=paymentData.pendingAmount;
    
    const pending=amountDue-amount;
    
    paymentData.pendingAmount=pending;
    
    //updating status
    if(pending==0)
    {
      paymentData.status="paid";
    }
    else if(pending<amountDue)
    {
      paymentData.status="partially paid"
    }
    await paymentData.save();
  }

  const orgId=paymentData?.dataValues.OrganisationId;

  const today=new Date();
  const formattedDate=today.toISOString().split('T')[0];
  
//generating invoice

  const Invoice=await invoice.create({
    amount:amount,
    customerId:customerId,
    organisationId:orgId,
    receivedOn:formattedDate,
    PaymentPlanPlanId:planId
  });



  //fetcing orgName and email based on Org id
  const orgData=await Organisation.findByPk(orgId);
  const orgName=orgData?.dataValues.Orgname;
  const orgEmail=orgData?.dataValues.email;


  //fetching Customer name and email based on customer id
  const CustomerData=await Customer.findByPk(customerId);
  const custName=CustomerData?.dataValues.Cust_name;
  const custEmail=CustomerData?.dataValues.Cust_email;
  
  //fetching details of the service for which amount is paid
  const particulars=paymentData?.dataValues.particulars;

  //sending payment success mail to both org and customer
  sendInvoice(orgName,custName,amount,orgEmail,custEmail,particulars);

  res.json(Invoice);


 }
 catch(err)
 {
  console.log(err);
 }

};


// export const getSowData=async(req:Request,res:Response)=>{
//     const customerId=(req as any).user.id;
//     console.log(customerId);
//     const sowData=await Sow.findAll({
//         include:[{
//             model:OrgCust,
//             where:{
//                 CustomerCustId:customerId,
//             },
//             attributes:[],
//         }]
//     });
//     res.json(sowData);
// }




// export const getPaymentPlans=async(req:Request,res:Response)=>{

//     const customerId=(req as any).user.id;
//     console.log("gettinhg plans of",customerId);
//     const paymentPlans=await PaymentPlan.findAll({
//         attributes:["planId","particulars","amount","dueDate","status","customerId","pendingAmount","SowSowId"],
//         where:{
//             customerId:customerId,
//         },
//       include:[{
//         model:Sow,
//         attributes:["projectName"],
//       }],
//     });

//     const output=paymentPlans.map(plan=>{
//       const url=`http://localhost:3001/customer/makePayment/${plan.planId}`;
//       const result={
//        particulars:plan.particulars,
//        amount:plan.amount,
//        dueDate:plan.dueDate,
//        status:plan.status,  
//        url
//       }
//       return result
//     });

//     res.json(output);
    

// }