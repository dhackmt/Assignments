import { Router } from "express";
import {customerLogin,customerPersonalData,getSowData,makePayment,getAllOrganisations,getPaymentPlans } from "../controllers/customerController";
import { isAuthorized } from "../middlewares/authorization";



const router=Router();



router.post("/signIn",customerLogin);
router.get("/",isAuthorized('Customer'),customerPersonalData);
router.get("/organisation",isAuthorized('Customer'),getAllOrganisations);
router.get("/sowData/:id",isAuthorized('Customer'),getSowData);
router.get("/paymentPlan/:id",isAuthorized('Customer'),getPaymentPlans);
router.post("/makePayment/:id",isAuthorized('Customer'),makePayment);


export default router;