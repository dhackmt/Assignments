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
require("./models/association");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/user", userRoute_1.default); //signup,signin
app.use("/dashboard", (0, authorization_1.isAuthorized)('Organisation'), dashboardRoute_1.default); // add client, get client, create sow
app.use("/customer", customerRoute_1.default);
pgConfig_1.default.authenticate().then(() => { console.log("Database authenticated"); }).catch((err) => { console.log("Database not authenticated", err); });
pgConfig_1.default.sync({ alter: true }).then(() => { console.log("Database Synced"); }).catch((err) => { console.log("Database not Synced", err); });
app.listen(PORT, () => {
    console.log("Server running on ", PORT);
});
