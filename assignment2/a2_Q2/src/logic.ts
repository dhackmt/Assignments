import {Request,Response} from 'express';
import {Data, Item,OrderBlocks, RequestBody, Student} from "./types/types"


//get all order ID
export function getOrderID(req:Request,res:Response){
    const items=req.body.items;
    
    const OrderIds=items.map((item:Item)=>{
        console.log(item.orderID);    
        return item.orderID;
    })
    res.json(OrderIds);
}


//get product code
export function getProductCode(req:Request,res:Response){
const items=req.body.items;

const ProductCodes = items.flatMap((item: Item) => 
    item.OrderBlocks.map((block: OrderBlocks) => block.ProductCode)
);

res.json(ProductCodes);
}

//get orderid and product code of orders with productcode starting with #3
export function findOrderBlock(req:Request,res:Response){
    const items=req.body.items;
    const OrderBlocksWith3=items.flatMap((item:Item)=>item.OrderBlocks.filter((block:OrderBlocks)=>block.ProductCode.startsWith('#3')).map((block)=>({orderid:item.orderID,productCode:block.ProductCode})));
    res.json(OrderBlocksWith3);
}

//filter orders with lineno >10

export function filterOrders(req:Request,res:Response){
    const items=req.body.items;
    const filteredOrders=items.filter((item:Item)=>item.OrderBlocks.some((block:OrderBlocks)=>{
        block.lineNo=Array.isArray(block.lineNo)?block.lineNo:[block.lineNo]
        return block.lineNo.some(no=>no>10);
    })).map((item:Item)=>item.orderID);
  res.json(filteredOrders);
}

// [
//     { "name": "Alice", "age": 20, "grade": 75 },
//     { "name": "Bob", "age": 22, "grade": 85 },
//     { "name": "Charlie", "age": 21, "grade": 60 },
//     { "name": "David", "age": 19, "grade": 45 },
//     { "name": "Eve", "age": 20, "grade": 90 }
//     ]

//increae grade of all  by 5

export function increaseGrade(req:Request,res:Response){
    const students=req.body;
    const newStudentData=students.map((student:Student)=>student.grade+5);
    console.log(newStudentData);
    console.log(students);
}

//getStudent with lowest grade

export function lowestGrade(req:Request,res:Response)
{
    const students=req.body;
    const lowestGrade=students.reduce((lowest:Student,student:Student)=>{
        return student.grade<lowest.grade?student :lowest
    },students[0]);
    res.json(lowestGrade);
}

//count number of passed students

export function countPassedStudents(req:Request,res:Response)
{
    const students=req.body;
   const passed=students.filter((student:Student)=>student.grade>50);
   res.send(`Passed Students are: ${passed.length}`);
}


//return a studnet object with name as key and age as value

export function getStudentObject(req:Request,res:Response){
    const students=req.body;
   const studnetObject=students.reduce((obj:{[key:string]:number},student:Student)=>{
    obj[student.name]=student.age;
    return obj;
   },{});
   res.json(studnetObject);
   
}
