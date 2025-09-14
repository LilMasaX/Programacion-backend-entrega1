import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Home view
router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { title: "Home", products });
});

// Real Time Products view
router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { title: "Productos en tiempo real", products });
});

export default router;
