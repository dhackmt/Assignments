import express from "express";
import pool from "./pgConfig";

const app=express();


async function checkAndCreateTableCreated(){
   try
    { 
        await pool.connect().then(()=>{console.log("..connected")}).catch((err)=>{console.log(err)});
   const checkTableQuery="SELECT exists(SELECT 1 from information_schema.tables WHERE table_name='student')";
    const result=await pool.query(checkTableQuery);
    if(result.rows[0].exists===false)   //result is object with elements row and rowmeta data so in that we access rows[0] has key value pair exists:true/false i.e fist returned row if it contains row:false then it means that not created
    {
        console.log("Table does not exists, creating one..");
        const createTableQuery="create table student(id int primary key,name varchar(200))";
        await pool.query(createTableQuery);
        console.log("..created");
    }
    else{
        console.log("Table already exists");
    }
   
}catch(err)
{
    console.log(err);
}
}

checkAndCreateTableCreated();

app.listen(3000,()=>{
    console.log("Server running");
})
