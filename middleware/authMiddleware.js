
import { decodedJWToken } from "../services/authServices.js";


export const authMiddleware = (req, res, next) => {
    const token = req.cookies.VISION_AUTH_TOKEN;
    req.user = null;
    if (!token) {
        return next();
    }

    try {
        const decodedRToken = decodedJWToken(token);
        req.user = decodedRToken;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        req.user = null;
        return next();
    }
};



