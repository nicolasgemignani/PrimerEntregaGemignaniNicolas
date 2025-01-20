import { Router } from 'express'

import viewCartRouter from './views/view.cart.router.js'
import viewProductRouter from './views/view.product.router.js'
import viewSessionRouter from './views/view.session.router.js'
import viewTickerRouter from './views/view.ticket.router.js'

const router = Router()


router.use('/', viewCartRouter)


router.use('/', viewProductRouter)


router.use('/', viewSessionRouter)


router.use('/', viewTickerRouter)

export default router