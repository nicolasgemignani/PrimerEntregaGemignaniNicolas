import express from 'express'
import CartController from '../../controller/api/cart.controller.js';

import { verifyToken } from '../../jwt/midllewares/jwtMiddles.js'

const router = express.Router()
const cartController = new CartController()


// Ruta para obtener un carrito por su ID
router.get('/:cartId', verifyToken, cartController.getCart);

// Ruta para actualizar los productos en el carrito
router.put('/:cartId',verifyToken, cartController.updateCart)

// Ruta para vaciar el carrito
router.delete('/:cartId',verifyToken, cartController.emptyCart)

// Ruta para eliminar el carrito
router.delete('/remove/:cartId',verifyToken, cartController.deleteCart);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cartId/product/:productId',verifyToken, cartController.updateQuantity)

// Ruta para agregar un producto al carrito
router.post('/products/:productId',verifyToken, cartController.addToCart)

// Ruta para eliminar un producto del carrito
router.delete('/:cartId/products/:productId',verifyToken, cartController.removeFromCart)



export default router