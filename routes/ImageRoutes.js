import { Router } from "express";
const router = Router();

import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateImg, imgUpload, sendUserChats, chatImageDelete, imgPublicPrivate } from "../controllers/imgGenerateController.js";









router.post('/generate', authMiddleware, generateImg)
router.get('/load-user-chats', authMiddleware, sendUserChats);
router.post('/image-delete', authMiddleware, chatImageDelete);
router.post('/public-private', authMiddleware, imgPublicPrivate);



router.get('/upload', imgUpload);



export const generateRoutes = router;


