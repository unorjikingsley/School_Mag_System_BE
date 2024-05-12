import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

import upload from "../middleware/multerMiddleware.js";

const router = Router();

// import rateLimiter from 'express-rate-limit'

// const apiLimiter = rateLimiter({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: { msg: 'IP rate limit exceeded, retry in 15 minutes' },
// })

router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);

export default router;
