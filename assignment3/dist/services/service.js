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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertWeather = void 0;
const weatherSchema_1 = require("../models/weatherSchema");
const InsertWeather = (city, country, weather, latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield weatherSchema_1.Weather.create({ city, country, weather, latitude, longitude });
        return data;
    }
    catch (err) {
        console.log(err);
    }
});
exports.InsertWeather = InsertWeather;
