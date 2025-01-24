import jwt from 'jsonwebtoken';


interface UserPayload {
  id: number;
  email: string;
  role: string;
}



const secret="Abc123";

export const createToken=(email:string,id:number,role:string)=>{
  const payload:UserPayload={
   id:id,
   email:email,
    role:role,
  }
  const token=jwt.sign(payload,secret);
  return token;
}


export const ValidateToken=(token:string)=>{
  try {
    const user=jwt.verify(token,secret) as UserPayload;
   return user;
  }
  catch(err)
  {
    return null;
  }
}