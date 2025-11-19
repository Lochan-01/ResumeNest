import { Router } from 'express'
import { getSuggestions, rewriteBullet } from '../controllers/suggestionsController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)
router.post('/', getSuggestions)
router.post('/rewrite', rewriteBullet)

export default router
