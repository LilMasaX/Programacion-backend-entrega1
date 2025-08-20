import { promises as fs} from "fs";
const path ="./src/data/products.json";

export default class ProductManager {
    async getProducts(){
        const data = await fs.readFile(path, "utf-8");
        return JSON.parse(data || "[]");
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: products.lenght ? products [products.lenght - 1].id + 1 : 1,
            ...product,
        };
        products.push(newProduct);
        await fs.writeFile(path, JSON.stringify(products, null, 2 ));
        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const index = products
    }
}