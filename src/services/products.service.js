import ProductManager from "../dao/ProductManager.js";

class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  async addProduct(product, uploadedBy) {
    if (!uploadedBy || !uploadedBy.isPremium) {
      // Verificar si el usuario es premium antes de permitir la subida del producto
      console.log("Error! User is not premium.");
      return null;
    }

    if (await this.productManager.validateCode(product.code)) {
      console.log("Error! Code exists!");
      return null;
    }

    // Agregar información sobre quién subió el producto
    return await this.productManager.addProduct({
      ...product,
      uploadedBy: uploadedBy._id, // ID del usuario que subió el producto
    });
  }

  async getProducts(params) {
    return await this.productManager.getProducts(params);
  }

  async getProductById(id) {
    return await this.productManager.getProductById(id);
  }

  async updateProduct(id, product) {
    return await this.productManager.updateProduct(id, product);
  }

  async deleteProduct(id) {
    return await this.productManager.deleteProduct(id);
  }
}

export default ProductService;
