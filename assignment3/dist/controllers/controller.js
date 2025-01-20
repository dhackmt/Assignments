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
exports.sendDataAsMail = exports.weatherDashboard = void 0;
exports.SaveWeatherMapping = SaveWeatherMapping;
const service_1 = require("../services/service");
const axios_1 = __importDefault(require("axios"));
const weatherSchema_1 = require("../models/weatherSchema");
const email_1 = require("../email/email");
const BASE_URL = "https://api.api-ninjas.com/v1/geocoding";
const API_KEY = "VkhEkEcrvcpKIQLITnvMxA==8SSCE29EeiHlLEgI";
const WEATHER_URL = "https://weatherapi-com.p.rapidapi.com/current.json";
const RAPID_API = "e0b9e3fcb2msh168bb1734b4d223p10176fjsna3aa10f5df1d";
function getRequestedData(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${BASE_URL}${endpoint}`, {
                headers: {
                    "X-Api-Key": API_KEY,
                }
            });
            return response.data;
        }
        catch (err) {
            console.log(err);
        }
    });
}
function getWeather(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${WEATHER_URL}?q=${query}`, {
                headers: {
                    "x-rapidapi-key": RAPID_API,
                }
            });
            return response;
        }
        catch (err) {
            console.log(err);
        }
    });
}
function SaveWeatherMapping(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = req.body;
        if (!items || !Array.isArray(items)) {
            res.status(400).json({ error: "Invalid request body. Expected an array of items." });
        }
        const results = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield getRequestedData(`/?city=${item.city}&country=${item.country}`);
                if (!response || response.length == 0) {
                    return { city: item.city, country: item.country, error: "Geocoding data not found" };
                }
                const { latitude, longitude } = response[0];
                const query = latitude + longitude;
                const weatherData = yield getWeather(query);
                if (!weatherData) {
                    return { city: item.city, country: item.country, error: "weather data not found" };
                }
                const weather = weatherData.data.current.condition.text;
                if (!latitude || !longitude || !weather) {
                    res.json({ error: "No data found" });
                    return;
                }
                const InsertedData = yield (0, service_1.InsertWeather)(item.city, item.country, weather, latitude, longitude);
                console.log(InsertedData);
            }
            catch (err) {
                console.log(err);
            }
        })));
        res.json({ message: "Data inserted successfully" });
    });
}
const weatherDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.params.city;
    if (city) {
        const condition = { where: { city: `${city}` } };
        const data = yield weatherSchema_1.Weather.findAll(condition);
        res.json({ data });
    }
    else {
        const data = yield weatherSchema_1.Weather.findAll();
        res.json({ data });
    }
});
exports.weatherDashboard = weatherDashboard;
const sendDataAsMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.body.city;
    try {
        if (city) {
            const condition = { where: { city: `${city}` } };
            const data = yield weatherSchema_1.Weather.findAll(condition);
            const content = `<html><table border=1>
                <tr>
                <th>city</th>
                <th>country</th>
                <th>weather</th>
                <th>Latitude</th>
                <th>longitude</th>
                </tr>
                ${data.map(rec => `
                    <tr>
                    <td>${rec.city}</td>
                    <td>${rec.country}</td>
                    <td>${rec.weather}</td>
                    <td>${rec.latitude}</td>
                    <td>${rec.longitude}</td>
                    </tr>
                    `).join(" ")}
                </table>
                </html>`;
            const result = yield (0, email_1.sendMail)(content);
            res.json({ message: "Mail sent" });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendDataAsMail = sendDataAsMail;
