import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();
const cm = new CartManager();

router.post("/", async (req, res) => {
    const newCart = await cm.createCart();
    res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
    const cart = await cm.getCardById(Number(req.params.cid));
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cart = await cm.addProductsToCart(Number(req.params.cid), Number(req.params.pid));
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
});

export default router;
