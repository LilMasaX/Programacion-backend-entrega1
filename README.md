# E-Commerce Backend API

## 🛍️ Descripción

Sistema completo de e-commerce backend desarrollado con **Node.js**, **Express** y **MongoDB**. Proporciona una API REST robusta para la gestión de productos y carritos de compras, con funcionalidades avanzadas de paginación, filtros, ordenamiento y actualización en tiempo real.

## ✨ Características Principales

### 🏪 Gestión de Productos
- **Paginación completa** con límites configurables
- **Filtros avanzados** por categoría, estado y disponibilidad
- **Ordenamiento dinámico** por precio (ascendente/descendente)
- **Búsqueda inteligente** por múltiples criterios
- **Persistencia MongoDB** con validación de datos
- **Actualización en tiempo real** via WebSockets

### 🛒 Sistema de Carritos
- **CRUD completo** de carritos con MongoDB
- **Referencias pobladas** automáticamente
- **Gestión granular** de productos y cantidades
- **Operaciones atómicas** para integridad de datos
- **Validación de stock** en tiempo real

### 🎨 Interfaz de Usuario
- **Diseño responsivo** moderno
- **Navegación intuitiva** entre vistas
- **Filtros interactivos** en tiempo real
- **Gestión visual** de carritos
- **Experiencia fluida** de usuario

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express.js** | 4.x | Framework web |
| **MongoDB** | 6+ | Base de datos NoSQL |
| **Mongoose** | 7+ | ODM para MongoDB |
| **Socket.io** | 4+ | Comunicación en tiempo real |
| **Handlebars** | 4+ | Motor de plantillas |
| **mongoose-paginate-v2** | 1+ | Paginación avanzada |

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18 o superior
- MongoDB 6 o superior (local o MongoDB Atlas)
- NPM o Yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Programacion-backend-entrega1
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
MONGODB_URI=mongodb://localhost:27017/ecommerce
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce
PORT=8080
```

4. **Poblar base de datos (opcional)**
```bash
npm run populate-db
```

5. **Iniciar el servidor**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:8080`

## 📚 Documentación de API

### 🛍️ Endpoints de Productos

#### `GET /api/products`
Obtiene lista paginada de productos con filtros opcionales.

**Query Parameters:**
| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `limit` | Number | Productos por página | 10 |
| `page` | Number | Número de página | 1 |
| `sort` | String | `asc` o `desc` por precio | - |
| `category` | String | Filtrar por categoría | - |
| `availability` | Boolean | Filtrar por disponibilidad | - |
| `query` | String | Búsqueda general | - |

**Ejemplo de Uso:**
```bash
GET /api/products?limit=5&page=2&sort=desc&category=Tecnología&availability=true
```

**Respuesta Exitosa:**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "...",
      "title": "iPhone 15",
      "price": 999,
      "category": "Tecnología",
      "stock": 50,
      "status": true
    }
  ],
  "totalPages": 10,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1&...",
  "nextLink": "/api/products?page=3&..."
}
```

#### `GET /api/products/:pid`
Obtiene un producto específico por ID.

#### `POST /api/products`
Crea un nuevo producto.

**Body Requerido:**
```json
{
  "title": "Producto Nuevo",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 299.99,
  "stock": 100,
  "category": "Tecnología",
  "status": true,
  "thumbnails": ["url1.jpg", "url2.jpg"]
}
```

#### `PUT /api/products/:pid`
Actualiza un producto existente.

#### `DELETE /api/products/:pid`
Elimina un producto.

### 🛒 Endpoints de Carritos

#### `POST /api/carts`
Crea un nuevo carrito vacío.

#### `GET /api/carts/:cid`
Obtiene carrito con productos poblados.

#### `POST /api/carts/:cid/product/:pid`
Agrega producto al carrito (incrementa cantidad si ya existe).

#### `DELETE /api/carts/:cid/products/:pid`
Elimina producto específico del carrito.

#### `PUT /api/carts/:cid`
Reemplaza todos los productos del carrito.

**Body:**
```json
{
  "products": [
    {
      "product": "product_id_1",
      "quantity": 2
    },
    {
      "product": "product_id_2", 
      "quantity": 1
    }
  ]
}
```

#### `PUT /api/carts/:cid/products/:pid`
Actualiza cantidad de producto específico.

**Body:**
```json
{
  "quantity": 5
}
```

#### `DELETE /api/carts/:cid`
Vacía completamente el carrito.

## 🌐 Rutas de Vistas

| Ruta | Descripción | Características |
|------|-------------|-----------------|
| `/` | Página de inicio | Redirección a productos |
| `/products` | Catálogo de productos | Paginación, filtros, ordenamiento |
| `/products/:pid` | Detalle de producto | Vista completa, agregar al carrito |
| `/carts/:cid` | Vista de carrito | Gestión completa, cálculo de totales |
| `/realtimeproducts` | Gestión en tiempo real | WebSockets, CRUD instantáneo |

## 📁 Arquitectura del Proyecto

```
📦 Programacion-backend-entrega1/
├── 📁 src/
│   ├── 📄 app.js                 # Servidor principal y configuración
│   ├── 📁 config/
│   │   └── 📄 database.js        # Configuración MongoDB
│   ├── 📁 models/
│   │   ├── 📄 Product.js         # Schema de productos
│   │   └── 📄 Cart.js           # Schema de carritos
│   ├── 📁 managers/
│   │   ├── 📄 ProductManager.js  # Lógica de negocio productos
│   │   └── 📄 cartManager.js    # Lógica de negocio carritos
│   ├── 📁 routes/
│   │   ├── 📄 products.router.js # API endpoints productos
│   │   ├── 📄 carts.router.js   # API endpoints carritos
│   │   └── 📄 views.router.js   # Rutas de vistas
│   └── 📁 scripts/
│       └── 📄 populateDB.js     # Datos de ejemplo
├── 📁 views/
│   ├── 📁 layouts/
│   │   └── 📄 main.handlebars   # Layout base
│   ├── 📄 products.handlebars   # Catálogo de productos
│   ├── 📄 productDetail.handlebars # Detalle de producto
│   ├── 📄 cart.handlebars       # Vista de carrito
│   ├── 📄 realTimeProducts.handlebars # Gestión tiempo real
│   └── 📄 home.handlebars       # Página inicio
├── 📁 public/
│   └── 📁 js/
│       └── 📄 realtime.js       # Cliente WebSocket
├── 📄 package.json              # Dependencias y scripts
├── 📄 README.md                 # Documentación
└── 📄 .env                      # Variables de entorno
```

## 🔧 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Poblar base de datos con datos de ejemplo
npm run populate-db

# Ejecutar en modo desarrollo con nodemon
npm run dev
```

## 🎯 Casos de Uso

### Para Desarrolladores Frontend
```javascript
// Obtener productos paginados
const response = await fetch('/api/products?page=1&limit=10&sort=asc');
const data = await response.json();

// Agregar producto al carrito
const cart = await fetch('/api/carts', { method: 'POST' });
const cartData = await cart.json();
await fetch(`/api/carts/${cartData._id}/product/${productId}`, { 
  method: 'POST' 
});
```

### Para Administradores
- Usar `/realtimeproducts` para gestión instantánea
- Monitorear carritos desde `/carts/:id`
- Filtrar productos por estado y categoría

### Para Usuarios Finales
- Navegar catálogo en `/products`
- Ver detalles en `/products/:id`
- Gestionar carrito en `/carts/:id`

## 🔍 Características Avanzadas

### 📊 Paginación Inteligente
- Navegación automática entre páginas
- Preservación de filtros activos
- Enlaces directos para SEO

### 🎛️ Filtrado Dinámico
- Combinación múltiple de filtros
- Persistencia en URL
- Feedback visual inmediato

### ⚡ Tiempo Real
- Actualizaciones instantáneas via Socket.io
- Sincronización automática entre clientes
- Gestión de estado coherente

### 🛡️ Validación y Seguridad
- Validación exhaustiva de datos
- Manejo robusto de errores
- Sanitización de entradas

## 🚦 Estado del Proyecto

### ✅ Completado
- [x] API REST completa
- [x] Persistencia MongoDB
- [x] Paginación avanzada
- [x] Filtros y ordenamiento
- [x] Vistas responsivas
- [x] WebSockets funcional
- [x] Validación de datos
- [x] Documentación completa

### 🔄 Próximas Mejoras
- [ ] Autenticación de usuarios
- [ ] Sistema de roles
- [ ] Cache con Redis
- [ ] Tests automatizados
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Desarrollado para Coderhouse - Programación Backend**

---

*Sistema e-commerce backend robusto y escalable con MongoDB, Express y Node.js* 🚀
