import mongoose from "mongoose";

import { cartService } from "../../service/index.service.js";
import { productService } from "../../service/index.service.js";

class ViewCartController {
    constructor(){
        this.cartService = cartService
        this.productService = productService
    }

    isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    addToCart = async (req, res) => {
        const { productId } = req.params;
        let { quantity } = req.body;

        try {
            // Validar que el ID del producto sea un ID de MongoDB válido
            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'ID del producto no válido' });
            }
    
            // Convertir la cantidad a un número entero y validar que sea positiva
            quantity = parseInt(quantity, 10);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Cantidad no válida' });
            }
    
            // Obtener el ID del carrito del usuario desde el token JWT
            const cartId = req.user.cart; // Asegúrate de que esto sea correcto

            // Verifica que el cartId esté definido
            if (!cartId) {
                return res.status(400).json({ error: 'El ID del carrito no está definido' });
            }
    
            // Agregar el producto al carrito existente
            const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
            return res.redirect('/products');
    
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error específico de carrito no encontrado
            if (error.message === 'Carrito no encontrado') {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
        }
    };

    getCart = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Validar que cartId sea un Objecto de Mongo
        const cartId = req.params.id;
        if (!this.isValidObjectId(cartId)) {
            return res.status(400).json({ error: 'Invalid cart ID format' });
        }
        try {
            const cart = await cartService.getCart(req.params.id);
            
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            // Verificar que el carrito pertenece al usuario autenticado
            if (cart.user && cart.user.toString() !== req.user.id) {
                return res.status(403).json({ error: 'No tienes permiso para acceder a este carrito' });
            }
    
            // Mapea los productos y ajusta la estructura
            const cartItems = Array.isArray(cart.products) ? await Promise.all(cart.products.map(async (item) => {
                const product = await productService.getProduct(item.product);
                
                if (!product) {
                    return null;
                }
    
                const totalPrice = item.quantity * product.price;
    
                return {
                    quantity: item._doc.quantity,  // Asegura que quantity esté en el nivel superior
                    product,  // Incluye los datos del producto completo
                    totalPrice
                };
            })) : [];
    
            const filteredCartItems = cartItems.filter(item => item !== null);

            // Calcular el total del carrito sumando el totalPrice de cada item
            const cartTotalPrice = parseFloat(filteredCartItems.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2));
    
            res.render('carrito', { cart: filteredCartItems, totalPrice: cartTotalPrice, cartId: cart._id });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error: error.message });
        }
    };

    emptyCart = async (req, res) => {
        try {
            const cartId = req.params.id;
            
            // Vaciar el carrito utilizando el servicio
            await cartService.emptyCart(cartId);

            // Redirigir a la vista del carrito con el id correspondiente
            res.redirect(`/carrito/${cartId}`);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'No se pudo vaciar el carrito, intente nuevamente' });
        }
    };
}

export default ViewCartController