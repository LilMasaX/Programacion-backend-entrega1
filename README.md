# Entrega N°2: Websockets y Handlebars

## Cambios realizados

- Se integró el motor de plantillas Handlebars para renderizar vistas dinámicas.
- Se creó la carpeta `views/` con las vistas `home.handlebars` y `realTimeProducts.handlebars`.
- Se agregó la carpeta `public/js` para scripts de cliente.
- Se integró Socket.io para comunicación en tiempo real.
- Se creó la ruta `/realtimeproducts` que muestra la lista de productos y permite agregar/eliminar productos en tiempo real usando websockets.
- Al agregar o eliminar un producto, la lista se actualiza automáticamente en todas las pestañas abiertas.

## Cómo probar la entrega

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar el servidor**
   ```bash
   npm start
   # o
   node src/app.js
   ```

3. **Probar vistas**
   - Accede a `http://localhost:8080/` para ver la lista de productos (vista estática).
   - Accede a `http://localhost:8080/realtimeproducts` en dos pestañas diferentes.
   - Usa los formularios para agregar o eliminar productos. La lista se actualizará automáticamente en ambas pestañas.

## Estructura relevante

- `src/app.js`: Configuración principal del servidor, Handlebars y Socket.io.
- `src/routes/views.router.js`: Rutas para las vistas.
- `views/`: Carpeta de vistas Handlebars.
- `public/js/realtime.js`: Lógica de cliente para websockets.

---

Cualquier duda, consultar el código o los comentarios en los archivos.
