import pool from './pgConfig'

export async function InsertOrderId(orderId:string):Promise<any>{
    try{
        const query="INSERT INTO orders(orderid) VALUES($1)";
        let result=await pool.query(query,[orderId]);
        return result;
    }
    catch(err)
    {
        console.log(err);
    }
}

