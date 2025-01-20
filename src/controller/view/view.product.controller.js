import { productService } from "../../service/index.service.js";

class ViewProductController {
    constructor(){
        this.productService = productService
    }
    
    paginateProducts = async (req, res) => {
        try {
            const listadoProducts = await productService.getAllProducts(req.query);
    
            // Elimina _id y retorna el resto de las propiedades
            const productsResultadoFinal = listadoProducts.docs.map(({ _id, ...rest }) => ({ _id, ...rest }));
    
            // Renderiza la vista con los productos y la información de paginación
            res.render('products', {
                products: productsResultadoFinal,
                hasPrevPage: listadoProducts.hasPrevPage,
                hasNextPage: listadoProducts.hasNextPage,
                prevPage: listadoProducts.prevPage,
                nextPage: listadoProducts.nextPage,
                currentPage: listadoProducts.page,
                totalPages: listadoProducts.totalPages,
                user: req.user // Pasa el objeto user a la vista
            });
    
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products'); // Considera un mensaje de error más descriptivo
        }
    }

    addProduct = async (req, res) => {
        try {
            const { title, description, code, price, status, stock, category } = req.body;
            const thumbnail = req.file ? req.file.path : ''; // Obtener la ruta de la imagen subida
    
            const newProduct = await productService.createProduct({
                title,
                description,
                code,
                price,
                status: status === 'true', // Convierte el valor a booleano
                stock,
                category,
                thumbnail
            });
    
            await newProduct.save();
            res.redirect('/products'); // Redirigir a la lista de productos después de guardar
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al agregar el producto');
        }
    }

    form = async (req, res) => {
        res.render('productForm', {})
    }

    updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, code, price, status, stock, category } = req.body;
            const thumbnail = req.file ? req.file.path : ''; // Obtener la ruta de la imagen subida
            
            // Actualizar el producto
            await productService.updateProduct(id, {
                title,
                description,
                code,
                price,
                status: status === 'true',
                stock,
                category,
                thumbnail
            });

            res.redirect('/products'); // Redirigir a la lista de productos después de actualizar
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar el producto');
        }
    }

    productId = async (req, res) => {
        try {
            const product = await productService.getProduct(req.params.id);
            if (!product) {
                return res.status(404).send("Producto no encontrado.");
            }
            res.render('updateProduct', { product });
        } catch (error) {
            console.error("Error al cargar el producto para edición:", error);
            res.status(500).send("Hubo un error al cargar el producto.");
        }
    }

    deleteProduct = async (req, res) => {
        try {
            await productService.deleteProduct(req.params.id);
            res.redirect('/products'); // Redirige a la lista de productos tras eliminar
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).send("Hubo un error al eliminar el producto.");
        }
    }
}

export default ViewProductController