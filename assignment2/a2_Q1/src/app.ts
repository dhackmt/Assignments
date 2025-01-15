import express from 'express';
import pool from "./pgConfig";
import {Item, OrderBlocks } from "./types/type";
import {InsertOrderId} from "./services"

const app=express();

const PORT=3000;

pool.connect().then(()=>{
    console.log("..database connected");
}).catch(()=>{
    console.log("..err in connection");
})

app.use(express.json());


app.post("/",async (req,res)=>{
   try{
    const body=req.body;
    const items=body.items;
    const orders=new Set<string>();
    items.forEach((item:Item) => {
        const filtereredItems=item.OrderBlocks.filter((block:OrderBlocks)=>{
            const lineNo=Array.isArray(block.lineNo)?block.lineNo:[block.lineNo];
            return lineNo.some((no)=>no%3==0);
        });

        if(filtereredItems.length>0)
        {
            orders.add(item.orderID);
        }
    });

   for(let order of orders)
   {
    try{
        await InsertOrderId(order);
    }
    catch(err)
    {
        console.log(err);
    }
   }
   res.send("Data inserted");
   }
   catch(err)
   {
    console.log(err);
    res.send("Error in inserting record");
   }
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})