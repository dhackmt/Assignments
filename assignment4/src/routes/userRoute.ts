import { Router } from "express";
import {createUser,loginUser} from "../controllers/userController";

const router=Router();

router.post("/signUp",createUser);
router.post("/signIn",loginUser);

export default router;