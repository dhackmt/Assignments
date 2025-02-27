"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post("/signUp", userController_1.createUser);
router.post("/signIn", userController_1.loginUser);
exports.default = router;
