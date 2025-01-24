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
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const paymentPlanSchema_1 = __importDefault(require("../models/paymentPlanSchema"));
const sequelize_1 = require("sequelize");
const sowSchema_1 = __importDefault(require("../models/sowSchema"));
const OrgCustSchema_1 = __importDefault(require("../models/OrgCustSchema"));
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
require("../models/association");
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const sendEmail_1 = require("../services/sendEmail");
const router = (0, express_1.Router)();
router.post("/", dashboardController_1.addClients);
router.get("/", dashboardController_1.getClient);
router.post("/createSow/:Cust_id", dashboardController_1.createSow);
router.post("/createSow/makePaymentPlan/:SowId", dashboardController_1.makePaymentPlan);
router.get("/date", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    try {
        const plansDueToday = yield paymentPlanSchema_1.default.findAll({
            where: (0, sequelize_1.where)((0, sequelize_1.fn)('DATE', (0, sequelize_1.col)('dueDate')), formattedDate),
        });
        if (plansDueToday.length > 0) {
            //get sowId of all the plans due on current date;
            const customerDetails = yield Promise.all(plansDueToday.map((plan) => __awaiter(void 0, void 0, void 0, function* () {
                const sowId = plan.dataValues.SowSowId;
                const particulars = plan.dataValues.particulars;
                const amount = plan.dataValues.amount;
                //use sow if to get all data from Sow table
                const SowData = yield sowSchema_1.default.findByPk(sowId);
                //use OrgCustId to get all data from OrgCust table
                const OrgCustData = yield OrgCustSchema_1.default.findByPk(SowData === null || SowData === void 0 ? void 0 : SowData.dataValues.OrgCustId);
                //use customer id to get customer data 
                const customerData = yield customerSchema_1.default.findByPk(OrgCustData === null || OrgCustData === void 0 ? void 0 : OrgCustData.dataValues.CustomerCustId);
                const OrganisationData = yield organisationSchema_1.default.findByPk(OrgCustData === null || OrgCustData === void 0 ? void 0 : OrgCustData.dataValues.OrganisationId);
                //use OrganisationData to get organisation email;
                const orgName = OrganisationData === null || OrganisationData === void 0 ? void 0 : OrganisationData.dataValues.Orgname;
                //use customer data to get email
                const email = customerData === null || customerData === void 0 ? void 0 : customerData.dataValues.Cust_email;
                console.log(email);
                (0, sendEmail_1.sendEmail)(orgName, email, particulars, amount);
            })));
            // const plansDueToday=await PaymentPlan.findAll({
            //         where:where(fn('DATE',col('dueDate')),formattedDate),
            //           include:[{
            //             model:Sow,
            //             include:[{
            //                 model:OrgCust,
            //                 attributes:["id"],
            //             }],
            //         }]
            //     }) ;
            //     console.log(plansDueToday.map(plan=>{
            //         plan.SowSowId;
            //     }))
            // // console.log(plansDueToday);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
exports.default = router;
