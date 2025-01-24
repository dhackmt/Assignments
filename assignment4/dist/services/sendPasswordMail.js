"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMailPassword = (Cust_email, randomPassword, OrgName) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
            user: 'djadhwani20@gmail.com',
            pass: 'aybjyprjekygnfay'
        }
    });
    const mailOptions = {
        from: 'djadhwani20@gmail.com',
        to: Cust_email,
        subject: 'Customer Added',
        text: `Respected Sir/ma'am 
    You have been successfully added as a client by ${OrgName}
    your password is: ${randomPassword}
    ThankYou!`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Mail sent" + info.response);
        }
    });
});
exports.sendMailPassword = sendMailPassword;
