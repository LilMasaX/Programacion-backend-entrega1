import express from "express";
import productsRouter from ".routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Not found

app.use("*", (req,res) => {
    res.status(404).json({
        error:"Not Found",
        message: `La ruta ${req.originalUrl} no existe`,
        status: 404
    });
})

//Start server

app.listen(8080, () => {
    console.log("Servidor escuchando en puerto 8080")
});