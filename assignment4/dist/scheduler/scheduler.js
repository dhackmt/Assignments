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
exports.checkPaymentPlans = void 0;
const paymentPlanSchema_1 = __importDefault(require("../models/paymentPlanSchema"));
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
require("../models/association");
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const sendEmail_1 = require("../services/sendEmail");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const sequelize_2 = __importDefault(require("sequelize"));
const checkPaymentPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const formattedDate = (0, date_fns_1.format)(today, "yyyy-MM-dd");
    try {
        console.log(formattedDate);
        const plansDueToday = yield paymentPlanSchema_1.default.findAll({
            where: { [sequelize_1.Op.and]: [
                    sequelize_2.default.where(sequelize_2.default.fn('DATE', sequelize_2.default.col('dueDate')), '<=', today),
                    {
                        status: {
                            [sequelize_1.Op.or]: ["pending", "partially paid"]
                        }
                    }
                ] }
        });
        if (plansDueToday.length > 0) {
            //     //get sowId of all the plans due on current date;
            //   const customerDetails=await Promise.all(plansDueToday.map(async(plan)=>{
            //     const sowId=plan.dataValues.SowSowId;
            //     const particulars=plan.dataValues.particulars;
            //     const amount=plan.dataValues.amount;
            //     //use sow if to get all data from Sow table
            //     const SowData=await Sow.findByPk(sowId);
            //     //use OrgCustId to get all data from OrgCust table
            //     const OrgCustData=await OrgCust.findByPk(SowData?.dataValues.OrgCustId);
            //     //use customer id to get customer data 
            //     const customerData=await Customer.findByPk(OrgCustData?.dataValues.CustomerCustId);
            //     const OrganisationData=await Organisation.findByPk(OrgCustData?.dataValues.OrganisationId);
            //     //use OrganisationData to get organisation ;
            //     const orgName=OrganisationData?.dataValues.Orgname;
            //     //use customer data to get email
            //     const email=customerData?.dataValues.Cust_email;
            //     console.log(email);
            //     sendEmail(orgName,email,particulars,amount);
            //    }));
            const result = yield Promise.all(plansDueToday.map((plan) => __awaiter(void 0, void 0, void 0, function* () {
                const orgId = plan.OrganisationId;
                const customerId = plan.customerId;
                //get orgname 
                const orgData = yield organisationSchema_1.default.findByPk(orgId);
                const orgName = orgData === null || orgData === void 0 ? void 0 : orgData.dataValues.Orgname;
                //get customer email
                const customerData = yield customerSchema_1.default.findByPk(customerId);
                const email = customerData === null || customerData === void 0 ? void 0 : customerData.dataValues.Cust_email;
                //get particulars:
                const particulars = plan.particulars;
                //pending amount:
                const pending = plan.pendingAmount;
                //send mail:
                (0, sendEmail_1.sendEmail)(orgName, email, particulars, pending);
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
});
exports.checkPaymentPlans = checkPaymentPlans;
