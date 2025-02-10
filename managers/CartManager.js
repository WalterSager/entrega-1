const fs = require("fs").promises;
const path = require("path");
const ProductManager = require("./ProductManager");
const productManager = new ProductManager();

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../data/carts.json");
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getCartsById(id) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === id)
    return cart || null;
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
      products: []
    };
  
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex === -1) throw new Error(`El carrito ${cartId} no existe`);

    const product = await productManager.getProductById(productId);
    if (!product) throw new Error(`El producto ${productId} no existe`);

    const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);
    if (productIndex !== -1) {
      carts[cartIndex].products[productIndex].quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    }

    await this.saveCarts(carts);
    return carts[cartIndex];
  }
  
}

module.exports = CartManager;
