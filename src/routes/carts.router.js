import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();
const cm = new CartManager();

// Crear carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cm.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener carrito por ID (con productos populados)
router.get("/:cid", async (req, res) => {
    try {
        const cart = await cm.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cart = await cm.addProductToCart(req.params.cid, req.params.pid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE api/carts/:cid/products/:pid - eliminar del carrito el producto seleccionado
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cm.removeProductFromCart(req.params.cid, req.params.pid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT api/carts/:cid - actualizar todos los productos del carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "Se requiere un array de productos" });
        }

        const cart = await cm.updateCart(req.params.cid, products);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT api/carts/:cid/products/:pid - actualizar SÓLO la cantidad de ejemplares del producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0" });
        }

        const cart = await cm.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE api/carts/:cid - eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await cm.clearCart(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json({ message: "Carrito vaciado exitosamente", cart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
