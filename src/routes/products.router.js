import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager();

router.get("/", async (req, res) => res.json(await pm.getProducts()));

router.get("/:pid", async (req, res) => {
    const product = await pm.getProductById(Number(req.params.pid));
    if (!product) return res.status(404).json({ error: "Porducto no encontrado"});
    res.json(product);
});

router.post("/", async (req, res) => {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const updated = await pm.updateProduct(Number(req.params.pid), req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado"});
    res.json(updated);
});

router.delete("/:pid", async (req, res) => {
    await pm.deleteProduct(Number(req.params.pid));
    res.json({ message: "Producto eleminado"});
});

export default router;