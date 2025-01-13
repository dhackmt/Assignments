import express from "express";
import {handleCheckMember} from "./logic.js";

const app=express();

const port=8000;

app.get("/",handleCheckMember);

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})
