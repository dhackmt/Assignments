import express from 'express';
import { getOrderID, getProductCode,findOrderBlock,filterOrders, increaseGrade, lowestGrade,countPassedStudents ,getStudentObject} from './logic';

const app=express();

const PORT=3000;
app.use(express.json());

app.post("/getOrderID",getOrderID);

app.post("/getProductCode",getProductCode);

app.post("/findOrderBlock",findOrderBlock);

app.post("/filterOrders",filterOrders);

app.post("/increaseGrade",increaseGrade);

app.post("/lowestGrade",lowestGrade);

app.post("/countPassedStudents",countPassedStudents);

app.post("/getStudentObject",getStudentObject);

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})