import nodemailer from "nodemailer";

export const sendMail=async(content:string)=>{
    const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
            user:"djadhwani20@gmail.com",
            pass:"jhj",
        }
    })
    
    const mailOPtions={
        from:"djadhwani20@gmail.com",
        to:"jadhwanidrishti@gmail.com",
        subject:"Data about city",
        html:content,
    };
    
    await transporter.sendMail(mailOPtions);
}


