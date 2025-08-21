import {promises as fs} from "fs";
const path = "./src/data/carts.json";

export default class CartManager {
    async getCarts() {
        const data = await fs.readFile(path, "utf-8");
        return JSON.parse(data || "[]");
    }

    async createCart(){
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: [],
        };
        carts.push(newCart);
        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCardById(id){
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async addProductsToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex (c => c.id === cid);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        const product = cart.products.find(p => p.product === pid);

        if (product){
            product.quanty++;
        } else{
            cart.products.push({ product: pid, quantity: 1});
        }

        carts[cartIndex] = cart;
        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return cart;
    }
}