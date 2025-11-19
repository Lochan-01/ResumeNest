import { Router } from 'express'
import {
  getResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController'
import { exportResumePDF } from '../controllers/pdfController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', getResumes)
router.post('/', createResume)
router.get('/:id', getResume)
router.put('/:id', updateResume)
router.delete('/:id', deleteResume)
router.get('/:id/export', exportResumePDF)

export default router
