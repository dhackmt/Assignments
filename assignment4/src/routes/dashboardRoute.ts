import  { Router } from "express";
import { addClients,createSow,makePaymentPlan,createLineItems} from "../controllers/dashboardController";

const router=Router();



router.post("/",addClients);
router.post("/createSow/:Cust_id",createSow);
router.post("/createSow/makePaymentPlan/:SowId",makePaymentPlan);
router.post("/createSow/lineItem/:id",createLineItems)


export default router;