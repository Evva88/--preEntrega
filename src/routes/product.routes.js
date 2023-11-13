import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsServices from "../services/products.service.js";
import productsController from "../controllers/products.controller.js";
import { authorization, passportCall } from "../midsIngreso/passAuth.js";
import errorHandler from "../services/errors/errorsHandler.js";
import { productModel as ProductModel } from "../dao/models/product.model.js";


const productsRouter = Router();
const PM = new ProductManager();
const productService = new ProductsServices();

productsRouter.get('/api/products', async (req, res) => {
  try {
    const products = await ProductModel.find({}, { _id: 1, title: 1, description: 1, price: 1, stock: 1, category: 1, thumbnail: 1, uploadedBy: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



productsRouter.get("/", passportCall('jwt'), authorization(['admin']), productsController.getProducts.bind(productsController));
productsRouter.get(
  "/:pid",
  productsController.getProductById.bind(productsController)
);
productsRouter.post('/', passportCall('jwt'), authorization(['admin']), productsController.addProduct.bind(productsController));
productsRouter.put('/:pid',passportCall('jwt'), authorization(['admin']), productsController.updateProduct.bind(productsController));
productsRouter.delete('/:pid',passportCall('jwt'), authorization(['admin']), productsController.deleteProduct.bind(productsController));

productsRouter.use(errorHandler);
export default productsRouter;