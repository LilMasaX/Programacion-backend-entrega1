import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

// Static files (for client-side js/css)
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Views router
import viewsRouter from "./routes/views.router.js";
app.use("/", viewsRouter);

// Not found
app.use("*", (req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `La ruta ${req.originalUrl} no existe`,
        status: 404
    });
});

// Start server with Socket.io
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// Socket.io connection
const productManager = new ProductManager();
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado por websocket");
    // Enviar productos actuales al conectar
    socket.emit("updateProducts", await productManager.getProducts());

    // Agregar producto
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        const products = await productManager.getProducts();
        io.emit("updateProducts", products);
    });

    // Eliminar producto
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(Number(id));
        const products = await productManager.getProducts();
        io.emit("updateProducts", products);
    });
});

// Export io para usar en otros módulos si es necesario
export { io };

httpServer.listen(8080, () => {
    console.log("Servidor escuchando en puerto 8080");
});