"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const dashboardRoute_1 = __importDefault(require("./routes/dashboardRoute"));
const customerRoute_1 = __importDefault(require("./routes/customerRoute"));
const authorization_1 = require("./middlewares/authorization");
const pgConfig_1 = __importDefault(require("./database/pgConfig"));
const node_cron_1 = __importDefault(require("node-cron"));
const scheduler_1 = require("./scheduler/scheduler");
require("./models/association");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/user", userRoute_1.default); //signup,signin
//only organization can access this route
app.use("/dashboard", (0, authorization_1.isAuthorized)('Organisation'), dashboardRoute_1.default); // add client, get client, create sow, make paymentplans
//only customer can access this route
app.use("/customer", customerRoute_1.default); //login,get all organisations,view all payment dues and make payments
//scheduled every one minute(for testing purpose)  to fetch paymnent due on current date and send them emails
node_cron_1.default.schedule('* * * * *', () => {
    console.log("cron scheduler running to check for payments");
    (0, scheduler_1.checkPaymentPlans)();
});
pgConfig_1.default.authenticate().then(() => { console.log("Database authenticated"); }).catch((err) => { console.log("Database not authenticated", err); });
pgConfig_1.default.sync({ alter: true }).then(() => { console.log("Database Synced"); }).catch((err) => { console.log("Database not Synced", err); });
app.listen(PORT, () => {
    console.log("Server running on ", PORT);
});
