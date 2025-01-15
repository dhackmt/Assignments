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
const app = (0, express_1.default)();
function checkAndCreateTableCreated() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pgConfig_1.default.connect().then(() => { console.log("..connected"); }).catch((err) => { console.log(err); });
            const checkTableQuery = "SELECT exists(SELECT 1 from information_schema.tables WHERE table_name='student')";
            const result = yield pgConfig_1.default.query(checkTableQuery);
            if (result.rows[0].exists === false) {
                console.log("Table does not exists, creating one..");
                const createTableQuery = "create table student(id int primary key,name varchar(200))";
                yield pgConfig_1.default.query(createTableQuery);
                console.log("..created");
            }
            else {
                console.log("Table already exists");
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
checkAndCreateTableCreated();
app.listen(3000, () => {
    console.log("Server running");
});
