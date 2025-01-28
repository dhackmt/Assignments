import PaymentPlan from "../models/paymentPlanSchema";
import Customer from "../models/customerSchema";
import "../models/association";
import Organisation from "../models/organisationSchema";
import { sendEmail } from "../services/sendEmail";
import { Op } from "sequelize";
import { format } from "date-fns";
import sequelize from "sequelize";


export const checkPaymentPlans=async()=>{
    const today=new Date();
    const formattedDate = format(today, "yyyy-MM-dd");

    try{
           
           console.log(formattedDate)
           const plansDueToday=await PaymentPlan.findAll({
               where:{[Op.and]:[
                sequelize.where(sequelize.fn('DATE',sequelize.col('dueDate')),'<=',today),
                {
                   status:{
                       [Op.or]:["pending","partially paid"]
                       }
                   
                }   
               ]}
           })
        if(plansDueToday.length>0)
        {

        //     //get sowId of all the plans due on current date;
        //   const customerDetails=await Promise.all(plansDueToday.map(async(plan)=>{
        //     const sowId=plan.dataValues.SowSowId;
        //     const particulars=plan.dataValues.particulars;
        //     const amount=plan.dataValues.amount;
        //     //use sow if to get all data from Sow table
        //     const SowData=await Sow.findByPk(sowId);

        //     //use OrgCustId to get all data from OrgCust table
        //     const OrgCustData=await OrgCust.findByPk(SowData?.dataValues.OrgCustId);
            
        //     //use customer id to get customer data 
        //     const customerData=await Customer.findByPk(OrgCustData?.dataValues.CustomerCustId);

        //     const OrganisationData=await Organisation.findByPk(OrgCustData?.dataValues.OrganisationId);

        //     //use OrganisationData to get organisation ;
        //     const orgName=OrganisationData?.dataValues.Orgname;

        //     //use customer data to get email
        //     const email=customerData?.dataValues.Cust_email;
        //     console.log(email);
        //     sendEmail(orgName,email,particulars,amount);
            
        //    }));


        const result=await Promise.all(plansDueToday.map(async(plan)=>{
            const orgId=plan.OrganisationId;
            const customerId=plan.customerId;
           
            //get orgname 
            const orgData=await Organisation.findByPk(orgId);
           const orgName=orgData?.dataValues.Orgname;


           //get customer email
           const customerData=await Customer.findByPk(customerId);
           const email=customerData?.dataValues.Cust_email;


           //get particulars:
           const particulars=plan.particulars;

           //pending amount:
           const pending=plan.pendingAmount;
               
           //send mail:
           sendEmail(orgName,email,particulars,pending);

        }));


        // const plansDueToday=await PaymentPlan.findAll({
        //         where:where(fn('DATE',col('dueDate')),formattedDate),
              
        //           include:[{
        //             model:Sow,
               
        //             include:[{
        //                 model:OrgCust,
        //                 attributes:["id"],
        //             }],
        //         }]
        //     }) ;
    
        //     console.log(plansDueToday.map(plan=>{
        //         plan.SowSowId;
        //     }))

        // // console.log(plansDueToday);
       

          
        }
    }
    catch(err)
    {
        console.log(err);
    }
}