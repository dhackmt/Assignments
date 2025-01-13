import express from "express";
import { handleSplitString,handleConcatString, handleQueryParamters } from "./logic.js";

const app=express();

const port=8000;

app.get("/split/:string1",handleSplitString);

//using params
app.get("/split/:string1/:string2",handleConcatString)

//using query paramaters

app.get("/split",handleQueryParamters);

app.listen(port,()=>{
    console.log(`server running on ${port}`);
})

