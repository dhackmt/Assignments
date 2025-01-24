"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const auth_1 = require("../services/auth");
const isAuthorized = (role) => (req, res, next) => {
    const UserData = req.headers['authorization'];
    if (!UserData) {
        res.json({ message: "You cannot access this page" });
        return;
    }
    const token = UserData.split(" ")[1];
    const user = (0, auth_1.ValidateToken)(token);
    if (!user) {
        res.json({ message: "You cannot access this page" });
        return;
    }
    if (!role.includes(user.role)) {
        res.json({ message: "You cannot access this page" });
        return;
    }
    // Proceed if the user is authorized
    req.user = { id: user.id, role: user.role };
    next();
};
exports.isAuthorized = isAuthorized;
