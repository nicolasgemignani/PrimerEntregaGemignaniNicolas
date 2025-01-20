import { sendEmail } from "../../utils/sendEmail.js";
import { ticketService } from "../../service/index.service.js";
import { cartService } from "../../service/index.service.js";

class ViewTicketController {
    constructor(){
        this.ticketService = ticketService
        this.cartService = cartService
    }
    
    createTicket = async (req, res) => {
        try {
            const userId = req.user.cart;
            const cart = await this.cartService.getCart(userId);
    
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ error: 'El carrito está vacío o no existe' });
            }
    
            const productosNoComprados = [];
            const productosComprados = [];
    
            // Procesar cada producto en el carrito
            for (let item of cart.products) {
                const producto = item.product;
                const cantidadSolicitada = item.quantity;
    
                // Verificar si hay suficiente stock o ajustar a la cantidad disponible
                if (producto.stock >= cantidadSolicitada) {
                    producto.stock -= cantidadSolicitada;
                    await producto.save();
                    productosComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidad: cantidadSolicitada,
                        precio: producto.price
                    });
                } else if (producto.stock > 0) {
                    // Comprar la cantidad que haya en stock si no alcanza para el total solicitado
                    productosComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidad: producto.stock,
                        precio: producto.price
                    });
                    productosNoComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidadFaltante: cantidadSolicitada - producto.stock
                    });
                    // Actualizar la cantidad restante en el carrito
                    item.quantity = cantidadSolicitada - producto.stock;
                    producto.stock = 0;
                    await producto.save();
                } else {
                    // Si no hay stock disponible en absoluto
                    productosNoComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidadFaltante: cantidadSolicitada
                    });
                }
            }
    
            // Calcular el monto total solo de los productos comprados
            const totalAmount = productosComprados.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
            let newTicket = null;
            if (productosComprados.length > 0) {
                const ticketData = {
                    amount: totalAmount,
                    purchaser: req.user.email,
                    products: productosComprados
                };
    
                // Crear el ticket para los productos comprados
                newTicket = await this.ticketService.createTicket(ticketData);
                if (!newTicket) {
                    return res.status(500).json({ error: 'No se pudo crear el ticket, intente nuevamente' });
                }
            }
    
            // Actualizar el carrito para que solo contenga productos no comprados o incompletos
            cart.products = cart.products.filter(item => productosNoComprados.some(p => p.producto.equals(item.product._id)));
            await cart.save();
    
            // Responder con el ticket y la lista de productos que no pudieron comprarse en su totalidad
            if (newTicket) {
                await sendEmail(req.user.email, newTicket, productosNoComprados, productosComprados);
                res.status(201).render('ticket', {
                    message: 'Compra procesada',
                    ticket: {
                        code: newTicket.code,
                        amount: newTicket.amount,
                        purchaser: newTicket.purchaser,
                        products: productosComprados
                    },
                    productosNoComprados
                });
            } else {
                res.status(400).json({ error: 'No se pudieron comprar productos debido a falta de stock' });
            }
    
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            res.status(500).json({ error: 'Error al crear el ticket. Intente nuevamente más tarde.' });
        }
    };

    ticketSucess = (req, res) => {
        res.render('ticket_success', { message: '¡Compra realizada con éxito! Gracias por su compra.' });
    }
}

export default ViewTicketController