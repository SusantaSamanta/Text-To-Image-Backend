import { Router } from "express";
const router = Router();
import { postLogin, postRegister, getCheck_Login, userLogout, userCreditsBalance, checkVerificationToken } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post('/register', postRegister);
router.get('/register/verify-email', checkVerificationToken);
router.post('/login', postLogin);
router.get('/check-login', authMiddleware, getCheck_Login);
// router.get('/credits', authMiddleware, userCreditsBalance); // in this time this is not use 
router.get('/logout', authMiddleware, userLogout);



export const authRoutes = router;


