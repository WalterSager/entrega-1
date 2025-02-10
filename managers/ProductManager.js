const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

  async getProducts() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }

  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);

    return product || null;
  }

  async addProduct({ title, description, code, price, status = true, stock, category, thumbnails }) {
    const products = await this.getProducts();

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        throw new Error("Todos los campos son obligatorios")
    }

    if (products.some(p => p.code === code)) {
        throw new Error (`El codigo " ${code} " ya existe.`);
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id +1 : 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;

  }

  async updateProduct(id, datos) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`No se encontro el producto con ID ${id}`);

    products[index] = { ...products[index], ...datos, id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts(); 
    const filteredProducts = products.filter(p => p.id !== id);
  
    if (filteredProducts.length === products.length) throw new Error(`No se encontró el producto con ID ${id}`);
  
    await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    return { mensaje: `Producto con ID ${id} eliminado correctamente` };
  }
  
}

module.exports = ProductManager;
