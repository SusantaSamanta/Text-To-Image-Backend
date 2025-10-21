import { Router } from "express";
const router = Router();
import { postLogin, postRegister } from "../controllers/authController.js";

router.post('/register', postRegister);
router.post('/login', postLogin);



export const authRoutes = router