import express from "express";
import {handleCheckMember} from "./logic.js";

const app=express();

const port=8000;

app.get("/",handleCheckMember);

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})








//routes -> controllers which has interfaces->services(all the logic) 
//entity:id,created at, updated at
//dto -> what to show to client
//pgservic in postgress only imp data lik