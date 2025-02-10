const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const manager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos"});
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await manager.getProductById(id);

    if (!product) {
        return res.status(404).json({ error: "El producto no existe"});
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error del servidor"});
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json({ message: "Producto agregado con exito", producto: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const updateProduct = await manager.updateProduct(id,req.body);
    res.json({ mensaje: "Producto actualizado", producto: updateProduct })
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid); // Convertir ID a número
    const result = await manager.deleteProduct(id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
