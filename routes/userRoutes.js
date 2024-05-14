import { Router } from 'express'
import { updateUser, assignDeanRole } from '../controllers/userController.js'

import upload from '../middleware/multerMiddleware.js'

const router = Router()

router.post('/update-user', upload.single('image'), updateUser)
router.post('/login', assignDeanRole)

export default router
