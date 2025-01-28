import express from 'express';
import dotenv from "dotenv";
import UserRoute from './routes/userRoute';
import dashboardRoute from './routes/dashboardRoute';
import customerRoute from './routes/customerRoute';
import { isAuthorized } from './middlewares/authorization';
import sequelize from './database/pgConfig';
import cron from "node-cron";
import { checkPaymentPlans } from './scheduler/scheduler';
import "./models/association";
dotenv.config();

const app=express();
const PORT=process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/user",UserRoute);//signup,signin

//only organization can access this route
app.use("/dashboard",isAuthorized('Organisation'),dashboardRoute); // add client, get client, create sow, make paymentplans

//only customer can access this route
app.use("/customer",customerRoute);  //login,get all organisations,view all payment dues and make payments



//scheduled every one minute(for testing purpose)  to fetch paymnent due on current date and send them emails
cron.schedule('* * * * *',()=>{
    console.log("cron scheduler running to check for payments");
    checkPaymentPlans();
});


sequelize.authenticate().then(()=>{console.log("Database authenticated")}).catch((err)=>{console.log("Database not authenticated",err)});

sequelize.sync({alter:true}).then(()=>{console.log("Database Synced")}).catch((err)=>{console.log("Database not Synced",err)});


app.listen(PORT,()=>{
    console.log("Server running on ",PORT);
});
