import nodemailer from "nodemailer";

export const sendMail=async(content:string)=>{
    const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
            user:"",//fromgmail
            pass:"",//passkey
        }
    })
    
    const mailOPtions={
        from:"",//fromgmail
        to:"",//togmail
        subject:"Data about city",
        html:content,
    };
    
    await transporter.sendMail(mailOPtions);
}


