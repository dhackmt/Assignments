import nodemailer from 'nodemailer'

export const sendInvoice=async(orgName:string,custName:string,amount:number,orgEmail:string,custEmail:string,particulars:string)=>{
const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    service:'gmail',
    auth:{
        user:'', //mailid,
        pass:''//app password'
    }
});
const mailOptions={
    from:'', //mail id
    to:[orgEmail,custEmail],
    subject:'Payment Success',
    text:`${custName} has successfully paid amount of ${amount} to ${orgName} !`

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