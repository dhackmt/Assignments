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
const express_1 = __importDefault(require("express"));
const pgConfig_1 = __importDefault(require("./pgConfig"));
const services_1 = require("./services");
const app = (0, express_1.default)();
const PORT = 3000;
pgConfig_1.default.connect().then(() => {
    console.log("..database connected");
}).catch(() => {
    console.log("..err in connection");
});
app.use(express_1.default.json());
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const items = body.items;
        const orders = new Set();
        items.forEach((item) => {
            const filtereredItems = item.OrderBlocks.filter((block) => {
                const lineNo = Array.isArray(block.lineNo) ? block.lineNo : [block.lineNo];
                return lineNo.some((no) => no % 3 == 0);
            });
            if (filtereredItems.length > 0) {
                orders.add(item.orderID);
            }
        });
        for (let order of orders) {
            try {
                yield (0, services_1.InsertOrderId)(order);
            }
            catch (err) {
                console.log(err);
            }
        }
        res.send("Data inserted");
    }
    catch (err) {
        console.log(err);
        res.send("Error in inserting record");
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
