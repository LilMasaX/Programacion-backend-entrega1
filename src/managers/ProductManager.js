import Product from '../models/Product.js';

class ProductManager {
    async getProducts(options = {}) {
        try {
            const {
                limit = 10,
                page = 1,
                sort,
                query,
                category,
                availability
            } = options;

            // Construir filtro de búsqueda según la consigna
            const filter = {};
            
            // Filtro por categoría específica
            if (category) {
                filter.category = { $regex: category, $options: 'i' };
            }
            
            // Filtro por disponibilidad
            if (availability !== undefined && availability !== '') {
                filter.status = availability === 'true';
            }
            
            // Query general (para búsqueda de texto)
            if (query) {
                // Buscar por categoría o disponibilidad según la consigna
                if (query.toLowerCase() === 'disponible' || query.toLowerCase() === 'available') {
                    filter.status = true;
                } else if (query.toLowerCase() === 'no disponible' || query.toLowerCase() === 'unavailable') {
                    filter.status = false;
                } else {
                    // Buscar por categoría o título
                    filter.$or = [
                        { category: { $regex: query, $options: 'i' } },
                        { title: { $regex: query, $options: 'i' } }
                    ];
                }
            }

            // Configurar ordenamiento por precio según la consigna
            let sortOption = {};
            if (sort) {
                if (sort.toLowerCase() === 'asc') {
                    sortOption.price = 1;
                } else if (sort.toLowerCase() === 'desc') {
                    sortOption.price = -1;
                }
            }

            // Opciones de paginación
            const options_paginate = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: Object.keys(sortOption).length > 0 ? sortOption : undefined,
                lean: true
            };

            const result = await Product.paginate(filter, options_paginate);

            // Construir links de navegación según la consigna
            const baseUrl = '/api/products';
            const buildLink = (pageNum) => {
                if (!pageNum) return null;
                const params = new URLSearchParams();
                params.set('page', pageNum);
                if (limit !== 10) params.set('limit', limit);
                if (sort) params.set('sort', sort);
                if (query) params.set('query', query);
                if (category) params.set('category', category);
                if (availability) params.set('availability', availability);
                return `${baseUrl}?${params.toString()}`;
            };

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.prevPage : null,
                nextPage: result.hasNextPage ? result.nextPage : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: buildLink(result.hasPrevPage ? result.prevPage : null),
                nextLink: buildLink(result.hasNextPage ? result.nextPage : null)
            };
        } catch (error) {
            return {
                status: 'error',
                payload: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            };
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id).lean();
        } catch (error) {
            throw new Error(`Error getting product: ${error.message}`);
        }
    }

    async addProduct(productData) {
        try {
            const { title, description, code, price, stock, category } = productData;
            
            if (!title || !description || !code || price === undefined || stock === undefined || !category) {
                throw new Error('Todos los campos requeridos deben estar presentes');
            }
            
            if (price < 0 || stock < 0) {
                throw new Error('El precio y stock deben ser números positivos');
            }
            
            const existingProduct = await Product.findOne({ code });
            if (existingProduct) {
                throw new Error('Ya existe un producto con ese código');
            }
            
            const product = new Product({
                ...productData,
                status: productData.status !== undefined ? productData.status : true
            });
            
            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`);
        }
    }

    async updateProduct(id, productData) {
        try {
            if (productData.code) {
                const existingProduct = await Product.findOne({ 
                    code: productData.code, 
                    _id: { $ne: id } 
                });
                if (existingProduct) {
                    throw new Error('Ya existe un producto con ese código');
                }
            }
            
            const updatedProduct = await Product.findByIdAndUpdate(
                id, 
                productData, 
                { new: true, runValidators: true }
            );
            
            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }
            
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado');
            }
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    // Método para obtener productos sin paginación (para websockets)
    async getAllProducts() {
        try {
            const products = await Product.find().lean();
            return products;
        } catch (error) {
            return [];
        }
    }
}

export default ProductManager;