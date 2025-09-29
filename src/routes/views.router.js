import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/cartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Home view - redirigir a productos
router.get("/", (req, res) => {
    res.redirect("/products");
});

// Vista de productos con paginación según la consigna
router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, availability } = req.query;
        
        const result = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
            category,
            availability
        });
        
        // Construir URLs para navegación en vistas
        const buildUrl = (pageNum) => {
            const params = new URLSearchParams();
            if (pageNum) params.set('page', pageNum);
            if (limit !== '10') params.set('limit', limit);
            if (sort) params.set('sort', sort);
            if (query) params.set('query', query);
            if (category) params.set('category', category);
            if (availability) params.set('availability', availability);
            return `/products?${params.toString()}`;
        };

        res.render("products", {
            title: "Productos",
            payload: result.payload,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            prevLink: result.hasPrevPage ? buildUrl(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildUrl(result.nextPage) : null,
            query: {
                limit,
                sort,
                search: query,
                category,
                availability
            }
        });
    } catch (error) {
        res.status(500).render("error", { 
            title: "Error", 
            message: "Error al cargar productos" 
        });
    }
});

// Vista de detalle de producto según la consigna (/products/:pid)
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render("error", { 
                title: "Error", 
                message: "Producto no encontrado" 
            });
        }
        res.render("productDetail", { 
            title: product.title, 
            product,
            style: "productDetail.css"
        });
    } catch (error) {
        res.status(500).render("error", { 
            title: "Error", 
            message: "Error al cargar el producto" 
        });
    }
});

// Vista de carrito específico según la consigna (/carts/:cid)
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).render("error", { 
                title: "Error", 
                message: "Carrito no encontrado" 
            });
        }
        
        // Calcular total del carrito
        const total = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.render("cart", { 
            title: "Carrito de Compras", 
            cart,
            products: cart.products,
            total: total.toFixed(2),
            cartId: req.params.cid,
            style: "cart.css"
        });
    } catch (error) {
        res.status(500).render("error", { 
            title: "Error", 
            message: "Error al cargar el carrito" 
        });
    }
});

// Real Time Products view (mantener funcionalidad existente con webhooks)
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render("realTimeProducts", { 
            title: "Productos en tiempo real", 
            products 
        });
    } catch (error) {
        res.status(500).render("error", { 
            title: "Error", 
            message: "Error al cargar productos en tiempo real" 
        });
    }
});

export default router;
