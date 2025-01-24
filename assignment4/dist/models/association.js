"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const OrgCustSchema_1 = __importDefault(require("./OrgCustSchema"));
const paymentPlanSchema_1 = __importDefault(require("./paymentPlanSchema"));
const sowSchema_1 = __importDefault(require("./sowSchema"));
//many to many association between org and customer
organisationSchema_1.default.belongsToMany(customerSchema_1.default, { through: OrgCustSchema_1.default });
customerSchema_1.default.belongsToMany(organisationSchema_1.default, { through: OrgCustSchema_1.default });
//one to one association between orgCustomer(each orgcustomer will have 1 sow) and sow
OrgCustSchema_1.default.hasOne(sowSchema_1.default);
sowSchema_1.default.belongsTo(OrgCustSchema_1.default);
//1 sow can have many payment plans
sowSchema_1.default.hasMany(paymentPlanSchema_1.default);
paymentPlanSchema_1.default.belongsTo(sowSchema_1.default);
