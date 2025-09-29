import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export default class CartManager {
    async getCarts() {
        try {
            const carts = await Cart.find().populate('products.product');
            return carts;
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product').lean();
            return cart;
        } catch (error) {
            return null;
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            // Verificar si el producto existe
            const product = await Product.findById(pid);
            if (!product) throw new Error('Product not found');

            // Buscar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (existingProductIndex >= 0) {
                // Si existe, incrementar cantidad
                cart.products[existingProductIndex].quantity += 1;
            } else {
                // Si no existe, agregarlo
                cart.products.push({ product: pid, quantity: 1 });
            }

            await cart.save();
            return await Cart.findById(cid).populate('products.product');
        } catch (error) {
            throw new Error(`Error adding product to cart: ${error.message}`);
        }
    }

    // DELETE api/carts/:cid/products/:pid - Eliminar del carrito el producto seleccionado
    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            cart.products = cart.products.filter(
                item => item.product.toString() !== pid
            );

            await cart.save();
            return await Cart.findById(cid).populate('products.product');
        } catch (error) {
            throw new Error(`Error removing product from cart: ${error.message}`);
        }
    }

    // PUT api/carts/:cid - Actualizar todos los productos del carrito con un arreglo de productos
    async updateCart(cid, products) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            // Validar que todos los productos existan
            for (const item of products) {
                const product = await Product.findById(item.product);
                if (!product) throw new Error(`Product ${item.product} not found`);
            }

            cart.products = products;
            await cart.save();
            return await Cart.findById(cid).populate('products.product');
        } catch (error) {
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }

    // PUT api/carts/:cid/products/:pid - Actualizar SÓLO la cantidad de ejemplares del producto
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );

            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return await Cart.findById(cid).populate('products.product');
        } catch (error) {
            throw new Error(`Error updating product quantity: ${error.message}`);
        }
    }

    // DELETE api/carts/:cid - Eliminar todos los productos del carrito
    async clearCart(cid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }
}