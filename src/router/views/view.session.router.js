import { Router } from 'express'

import ViewSessionController from '../../controller/view/view.session.controller.js'

const router = Router()
const viewSessionController = new ViewSessionController()

// Ruta para el registro
router.get('/register', viewSessionController.registro)

// Ruta para el login
router.get('/login', viewSessionController.login)

export default router