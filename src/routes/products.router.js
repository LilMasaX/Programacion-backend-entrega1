import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager();

// GET / - Con filtros, paginación y ordenamiento según la consigna
router.get("/", async (req, res) => {
    try {
        const { limit, page, sort, query, category, availability } = req.query;
        
        const result = await pm.getProducts({
            limit,
            page,
            sort,
            query,
            category,
            availability
        });
        
        res.json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await pm.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await pm.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updated = await pm.updateProduct(req.params.pid, req.body);
        if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await pm.deleteProduct(req.params.pid);
        if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;