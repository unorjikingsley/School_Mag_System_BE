import { Router } from "express";
import { registerUser } from "../controllers/authController.js";

import upload from "../middleware/multerMiddleware.js";

const router = Router();

router.post('/register', upload.single('image'), registerUser);

export default router;
