import { Router } from 'express'

import ViewTicketController from '../../controller/view/view.ticket.controller.js'
import { verifyToken } from '../../jwt/midllewares/jwtMiddles.js'

const router = Router()
const viewTicketController = new ViewTicketController()


router.post('/ticket/generar',verifyToken, viewTicketController.createTicket)

export default router