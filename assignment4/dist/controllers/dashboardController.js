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
exports.getClient = exports.makePaymentPlan = exports.createSow = exports.addClients = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const OrgCustSchema_1 = __importDefault(require("../models/OrgCustSchema"));
const sowSchema_1 = __importDefault(require("../models/sowSchema"));
const paymentPlanSchema_1 = __importDefault(require("../models/paymentPlanSchema"));
const crypto_1 = __importDefault(require("crypto"));
const sendPasswordMail_1 = require("../services/sendPasswordMail");
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
//add new customers
function generatePassword() {
    return crypto_1.default.randomBytes(4).toString('hex').slice(0, 4);
}
const addClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { Cust_name, Cust_email } = _a, otherDetails = __rest(_a, ["Cust_name", "Cust_email"]);
    const OrgId = req.user.id; //get orgid of currently loged in org
    console.log(req.body);
    try {
        //check if the customer already exists in our db
        const isExistingCutomer = yield customerSchema_1.default.findOne({
            where: {
                Cust_email: Cust_email,
            }
        });
        //check if the customer is already associated with the loged in org
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
                const url = `http://localhost:3001/dashboard/createSow/${customerId}`;
                res.json(`Now you can create sow for customer ${customerId} click here ${url}`);
            }
            ;
        }
        else {
            const randomPassword = generatePassword();
            const customer = yield customerSchema_1.default.create(Object.assign({ Cust_name,
                Cust_email, Cust_password: randomPassword }, otherDetails));
            const custId = customer.Cust_id;
            const joinTable = yield OrgCustSchema_1.default.create({
                OrganisationId: OrgId,
                CustomerCustId: custId,
            });
            const Org = yield organisationSchema_1.default.findByPk(OrgId);
            const OrgName = Org === null || Org === void 0 ? void 0 : Org.dataValues.Orgname;
            console.log("JOin table done", joinTable);
            (0, sendPasswordMail_1.sendMailPassword)(Cust_email, randomPassword, OrgName);
            const url = `http://localhost:3001/dashboard/createSow/${customer.Cust_id}`;
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
    const custId = parseInt(req.params.Cust_id);
    const { totalAmt, installments, months, projectName, sow_SignedOn } = req.body;
    const OrgId = req.user.id;
    const orgCustData = yield OrgCustSchema_1.default.findAll({
        where: {
            OrganisationId: OrgId,
            CustomerCustId: custId,
        }
    });
    const orgCustId = orgCustData[0].id;
    const sowData = yield sowSchema_1.default.create({
        OrgCustId: orgCustId,
        totalAmt,
        installments,
        months,
        sow_SignedOn,
        projectName
    });
    const url = `http://localhost:3001/dashboard/createSow/makePaymentPlan/${sowData.sowId}`;
    res.json({ message: `Now you can make payment plans for ${installments} installments clicke here ${url}` });
});
exports.createSow = createSow;
//payment plans;
const makePaymentPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { particulars, amount, dueDate, status } = req.body;
    const sowId = req.params.SowId;
    try {
        const sowData = yield sowSchema_1.default.findByPk(sowId);
        console.log(sowData === null || sowData === void 0 ? void 0 : sowData.dataValues.installments);
        const installments = sowData === null || sowData === void 0 ? void 0 : sowData.dataValues.installments;
        const countSowId = yield paymentPlanSchema_1.default.count({ where: {
                SowSowId: sowId
            } });
        console.log(countSowId);
        if (countSowId < installments) {
            const paymentPlanData = yield paymentPlanSchema_1.default.create({
                particulars,
                amount,
                dueDate,
                status,
                SowSowId: sowId
            });
            res.json({ message: `Payment plan created for ${dueDate}` });
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
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const OrgId = req.user.id;
    const customers = yield customerSchema_1.default.findAll();
    res.json(customers);
});
exports.getClient = getClient;
