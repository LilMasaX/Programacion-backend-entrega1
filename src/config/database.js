import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Base de datos ecommerce conectada exitosamente');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.log('Asegúrate de:');
        console.log('1. Tener MongoDB Atlas configurado');
        console.log('2. IP whitelisted en Atlas');
        console.log('3. URI correcta en MONGODB_URI');
        process.exit(1);
    }
};

export default connectDB;