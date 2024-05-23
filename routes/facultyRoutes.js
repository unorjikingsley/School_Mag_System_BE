import { Router } from 'express'
import { createFaculty, getAllFaculties, getFaculty, updateFaculty } from '../controllers/facultyController.js';

const router = Router()

router
  .route('/')
  .get(getAllFaculties)
  .post(createFaculty)

router
  .route('/:id')
  .get(getFaculty)
  .patch(updateFaculty)

export default router;
