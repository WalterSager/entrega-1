const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartsById(id);

    if (!cart) {
      return res.status(404).json({ error: "El carrito no existe" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid)
    const updateCart = await cartManager.addProductToCart(cartId, productId);
    res.json({ mensaje: "Agregado al carrito", carrito: updateCart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
})

module.exports = router;
