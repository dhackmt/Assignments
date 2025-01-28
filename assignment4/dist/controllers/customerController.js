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
exports.makePayment = exports.getPaymentPlans = exports.getSowData = exports.getAllOrganisations = exports.customerPersonalData = exports.customerLogin = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const auth_1 = require("../services/auth");
const OrgCustSchema_1 = __importDefault(require("../models/OrgCustSchema"));
const sowSchema_1 = __importDefault(require("../models/sowSchema"));
require("../models/association");
const paymentPlanSchema_1 = __importDefault(require("../models/paymentPlanSchema"));
const invoiceSchema_1 = __importDefault(require("../models/invoiceSchema"));
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const sendInvoice_1 = require("../services/sendInvoice");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT;
//login 
const customerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Cust_email, Cust_password } = req.body;
    const users = yield customerSchema_1.default.findAll({
        where: {
            Cust_email: Cust_email,
        }
    });
    if (users.length == 0) {
        res.json({ message: "No such User" });
        return;
    }
    const user = users[0];
    //Checks if entered password matches with password in database
    const ValidUser = Cust_password === user.Cust_password;
    if (!ValidUser) {
        res.json({ message: "Incorrect password" });
        return;
    }
    const token = (0, auth_1.createToken)(user.Cust_email, user.Cust_id, "Customer");
    res.json({ message: "Login SUccessful", token });
});
exports.customerLogin = customerLogin;
//fetching personal details
const customerPersonalData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerID = req.user.id;
    const customerData = yield customerSchema_1.default.findByPk(customerID);
    const response = `
  <table border="1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${customerData === null || customerData === void 0 ? void 0 : customerData.dataValues.Cust_name}</td>
        <td>${customerData === null || customerData === void 0 ? void 0 : customerData.dataValues.Cust_email}</td>
        <td>${customerData === null || customerData === void 0 ? void 0 : customerData.dataValues.Cust_phone}</td>
        <td>${customerData === null || customerData === void 0 ? void 0 : customerData.dataValues.Cust_address}</td>
      </tr>
    </tbody>
  </table>
`;
    res.send(response);
});
exports.customerPersonalData = customerPersonalData;
const getAllOrganisations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.user.id;
    //geting OrgId that matched the customer id in their joint table(org and cust has many to many association through OrgCust table)
    const OrgCustdata = yield OrgCustSchema_1.default.findAll({
        attributes: ["id", "OrganisationId"],
        where: {
            CustomerCustId: customerId,
        },
    });
    //Extracting only the OrgId from the OrgCust(join table of org and customer) data
    const OrgId = OrgCustdata.map(org => org.dataValues.OrganisationId);
    //Extracting only OrgCust id from the OrgCust data(join table of org and customer)
    const OrgCustId = OrgCustdata.map(orgCust => orgCust.id);
    //fetching Orgname baed on their ids;
    const OrgData = yield Promise.all(OrgId.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield organisationSchema_1.default.findOne({
            attributes: ["Orgname"],
            where: {
                id: id
            }
        });
    })));
    //OrgData is array of all the OrgNames associated with that particular customer
    const result = OrgData.map((org, index) => {
        return {
            //showing user each orgname he/she is associated with
            orgName: org,
            //this url contains OrgCust id(join table between org and cust) to view sow of only that organisation and customer
            sowUrl: `http://localhost:${PORT}/customer/sowData/${OrgCustId[index]}`,
        };
    });
    res.json(result);
});
exports.getAllOrganisations = getAllOrganisations;
const getSowData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //extracting orgCust id so that sow can be fetched for that particular org and cust only
    const orgCustId = parseInt(req.params.id);
    const sowData = yield sowSchema_1.default.findAll({
        attributes: ["sowId", "totalAmt", "installments", "months", "sow_SignedOn", "projectName"],
        where: {
            OrgCustId: orgCustId,
        },
    });
    const response = sowData.map(sow => {
        const result = {
            totalAmount: sow.dataValues.totalAmt,
            installments: sow.dataValues.installments,
            months: sow.dataValues.months,
            sowSignedOn: sow.dataValues.sow_SignedOn,
            projectName: sow.dataValues.projectName,
            //this url contains the sow id so that particular payment plan can be viewed
            url: `http://localhost:${PORT}/customer/paymentPlan/${sow.sowId}`,
        };
        return result;
    });
    res.json(response);
});
exports.getSowData = getSowData;
//payment plan
const getPaymentPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sowId = parseInt(req.params.id);
    const paymentData = yield paymentPlanSchema_1.default.findAll({
        //fetching payment plans or that partuiclar sow id only which was passed from url as params
        attributes: ["planId", "particulars", "amount", "dueDate", "status", "pendingAmount"],
        where: {
            SowSowId: sowId,
        },
    });
    const response = paymentData.map(data => {
        const result = {
            particulars: data.particulars,
            amount: data.amount,
            dueDate: data.dueDate,
            status: data.status,
            pendingAMount: data.pendingAmount,
            //on this url using planID ,that particular plan payment can be made
            url: `http://localhost:${PORT}/customer/makePayment/${data.planId}`
        };
        return result;
    });
    res.json(response);
});
exports.getPaymentPlans = getPaymentPlans;
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planId = parseInt(req.params.id);
    const { amount } = req.body;
    const customerId = req.user.id;
    try {
        const paymentData = yield paymentPlanSchema_1.default.findOne({
            where: {
                planId: planId,
            }
        });
        if (paymentData) {
            const amountDue = paymentData.pendingAmount;
            const pending = amountDue - amount;
            paymentData.pendingAmount = pending;
            //updating status
            if (pending == 0) {
                paymentData.status = "paid";
            }
            else if (pending < amountDue) {
                paymentData.status = "partially paid";
            }
            yield paymentData.save();
        }
        const orgId = paymentData === null || paymentData === void 0 ? void 0 : paymentData.dataValues.OrganisationId;
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        //generating invoice
        const Invoice = yield invoiceSchema_1.default.create({
            amount: amount,
            customerId: customerId,
            organisationId: orgId,
            receivedOn: formattedDate,
            PaymentPlanPlanId: planId
        });
        //fetcing orgName and email based on Org id
        const orgData = yield organisationSchema_1.default.findByPk(orgId);
        const orgName = orgData === null || orgData === void 0 ? void 0 : orgData.dataValues.Orgname;
        const orgEmail = orgData === null || orgData === void 0 ? void 0 : orgData.dataValues.email;
        //fetching Customer name and email based on customer id
        const CustomerData = yield customerSchema_1.default.findByPk(customerId);
        const custName = CustomerData === null || CustomerData === void 0 ? void 0 : CustomerData.dataValues.Cust_name;
        const custEmail = CustomerData === null || CustomerData === void 0 ? void 0 : CustomerData.dataValues.Cust_email;
        //fetching details of the service for which amount is paid
        const particulars = paymentData === null || paymentData === void 0 ? void 0 : paymentData.dataValues.particulars;
        //sending payment success mail to both org and customer
        (0, sendInvoice_1.sendInvoice)(orgName, custName, amount, orgEmail, custEmail, particulars);
        res.json(Invoice);
    }
    catch (err) {
        console.log(err);
    }
});
exports.makePayment = makePayment;
// export const getSowData=async(req:Request,res:Response)=>{
//     const customerId=(req as any).user.id;
//     console.log(customerId);
//     const sowData=await Sow.findAll({
//         include:[{
//             model:OrgCust,
//             where:{
//                 CustomerCustId:customerId,
//             },
//             attributes:[],
//         }]
//     });
//     res.json(sowData);
// }
// export const getPaymentPlans=async(req:Request,res:Response)=>{
//     const customerId=(req as any).user.id;
//     console.log("gettinhg plans of",customerId);
//     const paymentPlans=await PaymentPlan.findAll({
//         attributes:["planId","particulars","amount","dueDate","status","customerId","pendingAmount","SowSowId"],
//         where:{
//             customerId:customerId,
//         },
//       include:[{
//         model:Sow,
//         attributes:["projectName"],
//       }],
//     });
//     const output=paymentPlans.map(plan=>{
//       const url=`http://localhost:3001/customer/makePayment/${plan.planId}`;
//       const result={
//        particulars:plan.particulars,
//        amount:plan.amount,
//        dueDate:plan.dueDate,
//        status:plan.status,  
//        url
//       }
//       return result
//     });
//     res.json(output);
// }
