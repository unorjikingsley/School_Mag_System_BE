import { Router } from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);

export default router;
