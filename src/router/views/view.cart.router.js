import { Router } from 'express'

import ViewCartController from '../../controller/view/view.cart.controller.js'
import { passportCall, verifyToken } from '../../jwt/midllewares/jwtMiddles.js'
import { authorization } from '../../authorization/authorization.js'

const router = Router()
const viewCartController = new ViewCartController()

// Ruta para agregar productos al carrito
router.post('/cart/add/:productId', verifyToken, passportCall('jwt', { session: false }), authorization('user'), viewCartController.addToCart)


router.get('/carrito/:id',verifyToken, viewCartController.getCart)


router.post('/carrito/vaciar/:id', viewCartController.emptyCart)

export default router