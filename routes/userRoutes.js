import { Router } from 'express';
import { updateUser, getUser, getAllUsers } from '../controllers/userController.js';

import upload from '../middleware/multerMiddleware.js';

const router = Router();

router
  .route('/').get(getAllUsers)

router
  .route('/:id')
  .get(getUser)
  .patch(upload.single('image'), updateUser);
// router.post('/assign-dean', assignDeanRole);

export default router;
