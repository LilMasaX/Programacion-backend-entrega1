import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

const sampleProducts = [
    {
        title: "Laptop Gamer ASUS ROG",
        description: "Laptop de alto rendimiento con procesador Intel i7 de 11va generación, 16GB RAM, SSD 512GB, tarjeta gráfica RTX 3060. Ideal para gaming y trabajo profesional.",
        code: "LAP001",
        price: 1500,
        status: true,
        stock: 10,
        category: "Tecnología",
        thumbnails: [
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
        ]
    },
    {
        title: "Smartphone Samsung Galaxy S24",
        description: "Teléfono inteligente de última generación con cámara de 200MP, pantalla AMOLED de 6.8 pulgadas con 120Hz, 256GB almacenamiento, 5G, resistente al agua.",
        code: "PHN002",
        price: 1200,
        status: true,
        stock: 25,
        category: "Celulares",
        thumbnails: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
        ]
    },
    {
        title: "iPhone 15 Pro",
        description: "El iPhone más avanzado con chip A17 Pro, cámara con zoom óptico 3x, titanio premium, USB-C, 512GB de almacenamiento.",
        code: "PHN003",
        price: 1800,
        status: true,
        stock: 15,
        category: "Celulares",
        thumbnails: [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
        ]
    },
    {
        title: "Auriculares Sony WH-1000XM5",
        description: "Auriculares inalámbricos con cancelación de ruido líder en la industria, 30 horas de batería, sonido de alta resolución.",
        code: "AUD004",
        price: 350,
        status: true,
        stock: 30,
        category: "Tecnología",
        thumbnails: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ]
    },
    {
        title: "Smart TV Samsung 65 4K",
        description: "Televisor inteligente de 65 pulgadas con resolución 4K UHD, HDR10+, procesador Crystal 4K, compatible con Alexa y Google Assistant.",
        code: "TV005",
        price: 800,
        status: true,
        stock: 8,
        category: "Hogar",
        thumbnails: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"
        ]
    },
    {
        title: "Consola PlayStation 5",
        description: "La consola de videojuegos más avanzada con SSD ultra rápido, gráficos ray tracing, audio 3D y control DualSense con retroalimentación háptica.",
        code: "CON006",
        price: 500,
        status: true,
        stock: 12,
        category: "Tecnología",
        thumbnails: [
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500"
        ]
    },
    {
        title: "Tablet iPad Air",
        description: "Tablet potente con chip M1, pantalla Liquid Retina de 10.9 pulgadas, compatible con Apple Pencil y Magic Keyboard.",
        code: "TAB007",
        price: 600,
        status: true,
        stock: 20,
        category: "Tecnología",
        thumbnails: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
        ]
    },
    {
        title: "Smartwatch Apple Watch Series 9",
        description: "Reloj inteligente con GPS, monitor de salud avanzado, pantalla Always-On Retina, resistente al agua hasta 50 metros.",
        code: "WAT008",
        price: 400,
        status: true,
        stock: 25,
        category: "Tecnología",
        thumbnails: [
            "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500"
        ]
    },
    {
        title: "Cafetera Nespresso Vertuo",
        description: "Cafetera automática con tecnología de centrifugado, compatible con cápsulas Vertuo, prepara café, espresso y cappuccino.",
        code: "CAF009",
        price: 180,
        status: true,
        stock: 15,
        category: "Hogar",
        thumbnails: [
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500"
        ]
    },
    {
        title: "Bicicleta Eléctrica Mountain",
        description: "Bicicleta eléctrica para montaña con batería de larga duración, motor potente, suspensión completa y frenos hidráulicos.",
        code: "BIC010",
        price: 2200,
        status: false,
        stock: 0,
        category: "Deportes",
        thumbnails: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
        ]
    }
];

const populateDatabase = async () => {
    try {
        // Conectar a la base de datos usando tu configuración
        await connectDB();
        
        // Limpiar productos existentes
        await Product.deleteMany({});
        console.log('Base de datos limpiada');
        
        // Insertar productos de ejemplo
        const products = await Product.insertMany(sampleProducts);
        console.log(`${products.length} productos insertados correctamente`);
        
        // Mostrar productos insertados
        products.forEach(product => {
            console.log(`- ${product.title} (${product.code})`);
        });
        
        console.log('\n¡Base de datos poblada exitosamente!');
        console.log('Puedes iniciar el servidor con: npm start');
        process.exit(0);
    } catch (error) {
        console.error('Error poblando la base de datos:', error);
        process.exit(1);
    }
};

populateDatabase();