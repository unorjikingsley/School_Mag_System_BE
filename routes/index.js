import { Router } from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import facultyRoutes from "./facultyRoutes.js";

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);
router.use('/api/faculty', facultyRoutes);

export default router;
