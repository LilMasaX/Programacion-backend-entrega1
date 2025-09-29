import 'dotenv/config';
import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import ProductManager from "./managers/ProductManager.js";
import connectDB from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars setup con helpers para las vistas
app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        multiply: (a, b) => a * b,
        eq: (a, b) => a === b,
        ne: (a, b) => a !== b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b
    }
}));
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

// Start server with Socket.io (mantener webhooks)
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// Socket.io connection para productos en tiempo real
const productManager = new ProductManager();
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado por websocket");
    // Enviar productos actuales al conectar
    socket.emit("updateProducts", await productManager.getAllProducts());

    // Agregar producto
    socket.on("addProduct", async (product) => {
        try {
            await productManager.addProduct(product);
            const products = await productManager.getAllProducts();
            io.emit("updateProducts", products);
        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    });

    // Eliminar producto
    socket.on("deleteProduct", async (id) => {
        try {
            await productManager.deleteProduct(id);
            const products = await productManager.getAllProducts();
            io.emit("updateProducts", products);
        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    });
});

// Export io para usar en otros módulos si es necesario
export { io };

httpServer.listen(8080, () => {
    console.log("Servidor escuchando en puerto 8080");
    console.log("Visita: http://localhost:8080/products");
});