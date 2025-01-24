import nodemailer from 'nodemailer'

export const sendMailPassword=async(Cust_email:string,randomPassword:string,OrgName:string)=>{
const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    service:'gmail',
    auth:{
        user:'djadhwani20@gmail.com',
        pass:'aybjyprjekygnfay'
    }
});
const mailOptions={
    from:'djadhwani20@gmail.com',
    to:Cust_email,
    subject:'Customer Added',
    text:`Respected Sir/ma'am 
    You have been successfully added as a client by ${OrgName}
    your password is: ${randomPassword}
    ThankYou!`

};
transporter.sendMail(mailOptions,function(err,info){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Mail sent"+info.response);
    }
})
}