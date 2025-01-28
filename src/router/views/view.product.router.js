import { Router } from 'express'

import ViewProductController from '../../controller/view/view.product.controller.js';
import { passportCall, verifyToken } from '../../jwt/midllewares/jwtMiddles.js';
import { authorization, authToken } from '../../authorization/authorization.js';
import uploader from '../../utils/multer.js';

const router = Router()
const viewProductController = new ViewProductController()


// Ruta para obtener productos con paginacion
router.get('/products', verifyToken, authToken, viewProductController.paginateProducts);

// Ruta para el formulario que agrega productos
router.get('/add-products', authToken,viewProductController.form)


router.post('/addProducts', uploader.single('thumbnail') ,verifyToken, authToken, passportCall('jwt', { session: false }), authorization('admin'), viewProductController.addProduct)


router.post('/products/:id/update', uploader.single('thumbnail'), verifyToken, authToken,passportCall('jwt', { session: false }), authorization('admin'), viewProductController.updateProduct)


router.get('/edit-product/:id', authToken,viewProductController.productId)


router.post('/products/:id/delete', verifyToken, authToken,passportCall('jwt', { session: false }), authorization('admin'), viewProductController.deleteProduct);

export default router