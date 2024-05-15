import { Router } from 'express'
import { createFaculty } from '../controllers/facultyController.js';

const router = Router()

router.route('/').post(createFaculty)

export default router;
