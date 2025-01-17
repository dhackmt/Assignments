import { Router } from "express";
import { SaveWeatherMapping,weatherDashboard,sendDataAsMail} from "../controllers/controller";


const router=Router();


router.post("/SaveWeatherMapping",SaveWeatherMapping);
router.get("/weatherDashboard/:city?",weatherDashboard);
router.post("/sendMail",sendDataAsMail);
export default router;