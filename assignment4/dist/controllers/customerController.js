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
exports.getPaymentPlans = exports.getSowData = exports.customerPersonalData = exports.customerLogin = void 0;
const customerSchema_1 = __importDefault(require("../models/customerSchema"));
const auth_1 = require("../services/auth");
const OrgCustSchema_1 = __importDefault(require("../models/OrgCustSchema"));
const sowSchema_1 = __importDefault(require("../models/sowSchema"));
require("../models/association");
const paymentPlanSchema_1 = __importDefault(require("../models/paymentPlanSchema"));
const organisationSchema_1 = __importDefault(require("../models/organisationSchema"));
const customerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Cust_email, Cust_password } = req.body;
    console.log(Cust_email, Cust_password);
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
    const ValidUser = Cust_password === user.Cust_password;
    if (!ValidUser) {
        res.json({ message: "Incorrect password" });
        return;
    }
    const token = (0, auth_1.createToken)(user.Cust_email, user.Cust_id, "Customer");
    res.json({ message: "Login SUccessful", token });
});
exports.customerLogin = customerLogin;
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
const getSowData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.user.id;
    console.log(customerId);
    const sowData = yield sowSchema_1.default.findAll({
        include: [{
                model: OrgCustSchema_1.default,
                where: {
                    CustomerCustId: customerId,
                }
            }]
    });
    res.json(sowData);
});
exports.getSowData = getSowData;
const getPaymentPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.user.id;
    const paymentPlans = yield paymentPlanSchema_1.default.findAll({
        attributes: ["particulars", "amount", "dueDate", "status"],
        include: [{
                model: sowSchema_1.default,
                attributes: ["projectName"],
                include: [{
                        model: OrgCustSchema_1.default,
                        where: {
                            CustomerCustId: customerId,
                        },
                        attributes: [],
                        include: [{
                                model: organisationSchema_1.default,
                                attributes: ["Orgname"]
                            }]
                    }]
            }]
    });
    res.json(paymentPlans);
});
exports.getPaymentPlans = getPaymentPlans;
