import express from "express";
import { handleCheckLeapYear } from "./logic.js";

const app=express();
const port=8000;

app.get("/:year",handleCheckLeapYear)

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})