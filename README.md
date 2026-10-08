# API REST de Productos - Node.js, Express, TypeScript y MySQL2

Este proyecto es una API REST para la gestión de productos con soporte de persistencia en MySQL y bajas lógicas, desarrollada siguiendo las buenas prácticas de arquitectura en capas vistas en clase.

---

## Estructura del Proyecto

```text
tarea server/
├── src/
│   ├── app.ts                 # Punto de entrada de la aplicación
│   ├── server.ts              # Configuración y clase del servidor Express
│   ├── conf/
│   │   └── dbConnection.ts    # Pool de conexiones a MySQL con mysql2/promise
│   ├── routes/
│   │   ├── index.ts           # Enrutador principal (/api)
│   │   └── products.routes.ts # Rutas de productos (/api/v1/products)
│   └── controllers/
│       └── products.controller.ts # Lógica de negocio y consultas SQL parametrizadas
├── .env.example               # Plantilla de variables de entorno
├── .gitignore                 # Archivos y carpetas ignorados por Git
├── database.sql               # Script DDL de la tabla y datos iniciales de prueba
├── package.json               # Dependencias y scripts de ejecución
├── products.http              # Pruebas HTTP para extensiones REST Client
├── products.postman_collection.json # Colección de pruebas de Postman v2.1.0
├── tsconfig.json              # Configuración del compilador de TypeScript
└── README.md
```

---

## Requisitos previos

- **Node.js**: versión 18 o superior.
- **MySQL** o **MariaDB** ejecutándose localmente o en un contenedor.

---

## Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo `.env.example` como `.env` y ajusta las credenciales de tu base de datos:
   ```bash
   cp .env.example .env
   ```
   Contenido esperado:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=pos
   ```

3. **Cargar la base de datos:**
   Ejecuta el script `database.sql` en tu gestor de MySQL (o desde la consola):
   ```bash
   mysql -u root -p < database.sql
   ```

---

## Scripts Disponibles

- **Desarrollo con recarga en tiempo real:**
  ```bash
  npm run dev
  ```
- **Compilar el proyecto a JavaScript:**
  ```bash
  npm run build
  ```
- **Ejecutar la versión compilada:**
  ```bash
  npm start
  ```

---

## Endpoints de la API (`/api/v1/products`)

Todos los endpoints responden en formato JSON y utilizan consultas parametrizadas para garantizar la seguridad frente a inyecciones SQL.

| Método | Ruta | Descripción | Parámetros / Cuerpo | Códigos de respuesta |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/getAll` | Lista todos los productos activos. | Query opcional: `?active=true` o `?active=false` | `200`, `400`, `500` |
| `GET` | `/getById/:id` | Obtiene un producto activo por su ID. | Parámetro en ruta: `:id` (entero positivo) | `200`, `400`, `404`, `500` |
| `POST` | `/create` | Crea un nuevo producto con `active = TRUE`. | Body: `name`, `price`, `stock`, `description`, `brand`, `img` | `201`, `400`, `500` |
| `PUT` | `/update/:id` | Actualiza la información completa de un producto activo. | Parámetro `:id` y Body completo con nuevos datos | `200`, `400`, `404`, `500` |
| `DELETE` | `/delete/:id` | Baja lógica (actualiza `active = FALSE`). | Parámetro en ruta: `:id` (entero positivo) | `200`, `400`, `404`, `500` |
| `PATCH` | `/change-price/:id` | Modifica exclusivamente el precio de un producto activo. | Parámetro `:id` y Body: `{"price": 1200.50}` | `200`, `400`, `404`, `500` |

### Reglas de validación aplicadas:
- `:id` debe ser un número entero positivo mayor a cero (devuelve `400` en caso contrario).
- `price` debe ser numérico y mayor que cero (devuelve `400` si es inválido).
- `PATCH /change-price/:id` rechaza cuerpos con campos adicionales ajenos a `price`.
- Los productos inactivos no se devuelven en consultas habituales ni pueden ser modificados sin reactivación.
- Manejo seguro de errores internos sin exponer credenciales ni datos sensibles de MySQL.

---

## Evidencias de Prueba

Se incluyen dos métodos para verificar y evaluar todos los casos requeridos:
1. **Colección Postman**: Importa el archivo `products.postman_collection.json` en Postman, Bruno o Thunder Client. Contiene los 11 casos de prueba organizados secuencialmente.
2. **Archivo REST Client**: Abre el archivo `products.http` en VS Code utilizando la extensión REST Client para enviar las solicitudes de manera inmediata.
