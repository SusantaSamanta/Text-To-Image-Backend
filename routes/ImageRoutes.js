import { Router } from "express";
const router = Router();

import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateImg, imgProcessingController, imgUpload } from "../controllers/imgGenerateController.js";











router.post('/generate', authMiddleware, generateImg)
router.get('/processing', authMiddleware, imgProcessingController)
router.get('/upload', imgUpload);



export const generateRoutes = router;


