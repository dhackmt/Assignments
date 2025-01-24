import  { Router } from "express";
import { addClients,getClient,createSow,makePaymentPlan} from "../controllers/dashboardController";
import PaymentPlan from "../models/paymentPlanSchema";
import { where,fn,col } from "sequelize";
import Sow from "../models/sowSchema";
import OrgCust from "../models/OrgCustSchema";
import Customer from "../models/customerSchema";
import "../models/association";
import Organisation from "../models/organisationSchema";
import { sendEmail } from "../services/sendEmail";


const router=Router();



router.post("/",addClients);
router.get("/",getClient);
router.post("/createSow/:Cust_id",createSow);
router.post("/createSow/makePaymentPlan/:SowId",makePaymentPlan);
router.get("/date",async(req,res)=>{
    const today=new Date();
    const formattedDate=today.toISOString().split('T')[0];

    try{
        const plansDueToday=await PaymentPlan.findAll({
            where:where(fn('DATE',col('dueDate')),formattedDate),
        }) ;
        if(plansDueToday.length>0)
        {

            //get sowId of all the plans due on current date;
          const customerDetails=await Promise.all(plansDueToday.map(async(plan)=>{
            const sowId=plan.dataValues.SowSowId;
            const particulars=plan.dataValues.particulars;
            const amount=plan.dataValues.amount;
            //use sow if to get all data from Sow table
            const SowData=await Sow.findByPk(sowId);

            //use OrgCustId to get all data from OrgCust table
            const OrgCustData=await OrgCust.findByPk(SowData?.dataValues.OrgCustId);
            
            //use customer id to get customer data 
            const customerData=await Customer.findByPk(OrgCustData?.dataValues.CustomerCustId);

            const OrganisationData=await Organisation.findByPk(OrgCustData?.dataValues.OrganisationId);

            //use OrganisationData to get organisation email;
            const orgName=OrganisationData?.dataValues.Orgname;

            //use customer data to get email
            const email=customerData?.dataValues.Cust_email;
            console.log(email);
            sendEmail(orgName,email,particulars,amount);
            
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
})

export default router;