"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controllers/controller");
const router = (0, express_1.Router)();
router.post("/SaveWeatherMapping", controller_1.SaveWeatherMapping);
router.get("/weatherDashboard/:city?", controller_1.weatherDashboard);
router.post("/sendMail", controller_1.sendDataAsMail);
exports.default = router;
