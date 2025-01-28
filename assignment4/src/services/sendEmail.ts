import nodemailer from 'nodemailer'

export const sendEmail=async(orgName:string,email:string,particulars:string,amount:number)=>{
const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    service:'gmail',
    auth:{
        user:'', //mailid,
        pass:''//app password
    }
});
const mailOptions={
    from:'',//mailid
    to:email,
    subject:'Payment Due Date',
    text:`Respected Sir/ma'am 
    You are due ${amount} to ${orgName} for ${particulars}.Kindly pay all your dues 
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