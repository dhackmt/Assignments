import { Router } from "express";
import {customerLogin,customerPersonalData,getSowData,getPaymentPlans } from "../controllers/customerController";
import { isAuthorized } from "../middlewares/authorization";


const router=Router();

router.post("/signIn",customerLogin);
router.get("/",isAuthorized('Customer'),customerPersonalData);
router.get("/sowData",isAuthorized('Customer'),getSowData);
router.get("/getPaymentPlans",isAuthorized('Customer'),getPaymentPlans);


export default router;