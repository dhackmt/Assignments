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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.createLineItems = exports.makePaymentPlan = exports.createSow = exports.addClients = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const OrgCustSchema_1 = __importDefault(require("../models/OrgCustSchema"));
const sowSchema_1 = __importDefault(require("../models/sowSchema"));
const paymentPlanSchema_1 = __importDefault(require("../models/paymentPlanSchema"));
const crypto_1 = __importDefault(require("crypto"));
const sendPasswordMail_1 = require("../services/sendPasswordMail");
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const dotenv_1 = __importDefault(require("dotenv"));
const LineItemsSchema_1 = __importDefault(require("../models/LineItemsSchema"));
dotenv_1.default.config();
const PORT = process.env.PORT;
//this function is to generate random passowrd for customer login when organisation add them as their client, customer get this password via mail
function generatePassword() {
    return crypto_1.default.randomBytes(4).toString('hex').slice(0, 4);
}
//adding customers
const addClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { Cust_name, Cust_email } = _a, otherDetails = __rest(_a, ["Cust_name", "Cust_email"]);
    const OrgId = req.user.id; //get orgid of currently loged in org
    try {
        //check if the customer already exists in our db, if yes than no new record for that customer will be created
        const isExistingCutomer = yield customerSchema_1.default.findOne({
            where: {
                Cust_email: Cust_email,
            }
        });
        //check if the customer is already associated with the loged in org, if yes than directly sow can be created or else association is defined
        if (isExistingCutomer) {
            const customerId = isExistingCutomer.Cust_id;
            const isOrgCust = yield OrgCustSchema_1.default.findOne({
                where: {
                    OrganisationId: OrgId,
                    CustomerCustId: customerId,
                }
            });
            if (isOrgCust) {
                const url = `http://localhost:3001/dashboard/createSow/${customerId}`;
                res.json(`Now you can create sow for customer ${customerId} click here ${url}`);
            }
            else {
                const joinTable = yield OrgCustSchema_1.default.create({
                    OrganisationId: OrgId,
                    CustomerCustId: customerId,
                });
                const url = `http://localhost:${PORT}/dashboard/createSow/${customerId}`;
                res.json(`Now you can create sow for customer ${customerId} click here ${url}`);
            }
            ;
        }
        else {
            //generating password for newly added customer
            const randomPassword = generatePassword();
            // adding customer
            const customer = yield customerSchema_1.default.create(Object.assign({ Cust_name,
                Cust_email, Cust_password: randomPassword }, otherDetails));
            const custId = customer.Cust_id;
            //adding orgId and customerID in their join table because org and customer has many to many relationship
            const joinTable = yield OrgCustSchema_1.default.create({
                OrganisationId: OrgId,
                CustomerCustId: custId,
            });
            //fetching organisation name
            const Org = yield organisationSchema_1.default.findByPk(OrgId);
            const OrgName = Org === null || Org === void 0 ? void 0 : Org.dataValues.Orgname;
            console.log("JOin table done", joinTable);
            //sending password to newly added customer via mail
            (0, sendPasswordMail_1.sendMailPassword)(Cust_email, randomPassword, OrgName);
            //adds customer id as params so that sow can be created for that particular customer only
            const url = `http://localhost:${PORT}/dashboard/createSow/${customer.Cust_id}`;
            res.json(`Now you can create sow for customer ${customer.Cust_id} click here ${url}`);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error", err });
        return;
    }
});
exports.addClients = addClients;
//sow creation
const createSow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //fetching customer id from params(passed at the time of sow creation) so that sow can be created for that particular customer only
        const custId = parseInt(req.params.Cust_id);
        const { totalAmt, installments, months, projectName, sow_SignedOn } = req.body;
        const OrgId = req.user.id;
        //getting OrgCUst id sow that sow can be created for that particular organisation and customer only, this id is passed in sow table as foreign key to create association
        const orgCustData = yield OrgCustSchema_1.default.findAll({
            where: {
                OrganisationId: OrgId,
                CustomerCustId: custId,
            }
        });
        const orgCustId = orgCustData[0].id;
        //creating sow
        const sowData = yield sowSchema_1.default.create({
            OrgCustId: orgCustId,
            totalAmt,
            installments,
            months,
            sow_SignedOn,
            projectName
        });
        //passing sowId here so that payment plan can be created for that particluar sow
        const url = `http://localhost:${PORT}/dashboard/createSow/makePaymentPlan/${sowData.sowId}`;
        res.json({ message: `Now you can make payment plans for ${installments} installments clicke here ${url}` });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error", err });
        return;
    }
});
exports.createSow = createSow;
//payment plans;
const makePaymentPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { particulars, amount, dueDate, status } = req.body;
    const sowId = req.params.SowId;
    const orgId = req.user.id;
    try {
        const sowData = yield sowSchema_1.default.findByPk(sowId);
        //installments
        //number of installments= number of payment plans
        const installments = sowData === null || sowData === void 0 ? void 0 : sowData.dataValues.installments;
        //orgCustID fetching this so that we can find exact customer
        const orgCustId = sowData === null || sowData === void 0 ? void 0 : sowData.dataValues.OrgCustId;
        const OrgCustData = yield OrgCustSchema_1.default.findByPk(orgCustId);
        //customerId
        const customerId = OrgCustData === null || OrgCustData === void 0 ? void 0 : OrgCustData.dataValues.CustomerCustId;
        //fetching count of each sowID to see how many more payment plans are left to create
        const countSowId = yield paymentPlanSchema_1.default.count({ where: {
                SowSowId: sowId
            } });
        //checkinh if organisation is creating payment plans more than the number of installments defined
        if (countSowId < installments) {
            const paymentPlanData = yield paymentPlanSchema_1.default.create({
                particulars,
                amount,
                dueDate,
                status,
                customerId: customerId,
                OrganisationId: orgId,
                pendingAmount: amount,
                SowSowId: sowId
            });
            const planId = paymentPlanData.dataValues.planId;
            console.log(planId);
            const url = `http://localhost:${PORT}/dashboard/createSow/lineItem/${planId}`;
            res.json({ message: `Payment plan created for ${dueDate} now you can proceed with lineItems: ${url}` });
        }
        else {
            res.json({ message: `You can create only ${installments} payment plans` });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.makePaymentPlan = makePaymentPlan;
//creating LineItems to give briefing of each payment plan
const createLineItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { particulars, amount } = req.body;
    const planId = parseInt(req.params.id);
    const LineItem = yield LineItemsSchema_1.default.create({
        amount: amount,
        particulars: particulars,
        PaymentPlanPlanId: planId,
    });
    res.json(LineItem);
});
exports.createLineItems = createLineItems;
//fetching client details of each org
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const OrgId = req.user.id;
    const customers = yield customerSchema_1.default.findAll({
        attributes: ["Cust_email", "Cust_name"],
        include: [{
                model: OrgCustSchema_1.default,
                where: {
                    OrganisationId: OrgId
                }
            }]
    });
    res.json(customers);
});
exports.getClient = getClient;
