import express from 'express';
import dotenv from "dotenv";
import UserRoute from './routes/userRoute';
import dashboardRoute from './routes/dashboardRoute';
import customerRoute from './routes/customerRoute';
import { isAuthorized } from './middlewares/authorization';
import sequelize from './database/pgConfig';
import "./models/association";
dotenv.config();

const app=express();
const PORT=process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({extended:false}));




app.use("/user",UserRoute);//signup,signin
app.use("/dashboard",isAuthorized('Organisation'),dashboardRoute); // add client, get client, create sow
app.use("/customer",customerRoute);


sequelize.authenticate().then(()=>{console.log("Database authenticated")}).catch((err)=>{console.log("Database not authenticated",err)});

sequelize.sync({alter:true}).then(()=>{console.log("Database Synced")}).catch((err)=>{console.log("Database not Synced",err)});


app.listen(PORT,()=>{
    console.log("Server running on ",PORT);
});