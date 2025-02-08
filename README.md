# 🛒 Product & Cart Management API

¡Bienvenido! 🚀  
Esta API permite gestionar productos y carritos de compra de manera eficiente, con características avanzadas como paginación, filtrado, ordenamiento y más. 🎯

---

## 🌐 URLs de Prueba

### 🏠 Página Principal
- **URL**: [http://localhost:8080/products](http://localhost:8080/products)

### 📦 Página de Productos
- **URL**: [http://localhost:8080/api/products](http://localhost:8080/api/products)

### Docker
- **URL**: [https://hub.docker.com/r/nicolasgemi/dockeroperation](https://hub.docker.com/r/nicolasgemi/dockeroperation)

docker pull nicolasgemi/dockeroperation
---

## 🔐 Login

| **Email**                                 | **Password** |
|-------------------------------------------|--------------|
| `nicolasgemignani@outlook.com` (ADMIN)    | `123456`     |
| `sofiaG@outlook.com` (USER)               | `123456`     |

- **URL**: [http://localhost:8080/login](http://localhost:8080/login)

---

## 📦 Gestión de Productos

### ➕ Agregar un Producto
- **Método**: `POST`  
- **URL**: [http://localhost:8080/api/products](http://localhost:8080/api/products)  
- **Body**:
  ```json
  {
      "title": "Laptop ABC",
      "description": "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
      "code": "LT456",
      "price": 899.99,
      "status": true,
      "stock": 30,
      "category": "Computers",
      "thumbnail": "https://example.com/images/lt456.jpg"
  }
  ```

### 🔍 Buscar un Producto
- **Método**: `GET`  
- **URL**: `http://localhost:8080/api/products/(ID_DEL_PRODUCTO)`

### ✏️ Actualizar un Producto
- **Método**: `PUT`  
- **URL**: `http://localhost:8080/api/products/(ID_DEL_PRODUCTO)`  
- **Body**:
  ```json
  {
      "title": "Digital Camera"
  }
  ```

### 🗑️ Borrar un Producto
- **Método**: `DELETE`  
- **URL**: `http://localhost:8080/api/products/(ID_DEL_PRODUCTO)`

### 🔍 Búsquedas Avanzadas
- **Paginación**:  
  `GET http://localhost:8080/api/products?limit=5&page=1`  
- **Paginación + Ordenamiento**:  
  `GET http://localhost:8080/api/products?limit=5&page=1&sort=price:1`  
- **Paginación + Filtro**:  
  `GET http://localhost:8080/api/products?limit=5&page=1&query={"category":"Electronics"}`  

---

## 🛒 Gestión de Carritos

### ➕ Crear un Carrito
- **Método**: `POST`  
- **URL**: [http://localhost:8080/api/carts](http://localhost:8080/api/carts)

### ➕ Agregar Producto al Carrito
- **Método**: `POST`  
- **URL**: `http://localhost:8080/api/carts/(ID_DEL_CARRITO)/products/(ID_DEL_PRODUCTO)`  
- **Body**:
  ```json
  {
      "quantityToAdd": 10
  }
  ```

### 👀 Ver Carrito
- **Método**: `GET`  
- **URL**: `http://localhost:8080/api/carts/(ID_DEL_CARRITO)`

### 🔄 Actualizar Productos en un Carrito
- **Método**: `PUT`  
- **URL**: `http://localhost:8080/api/carts/(ID_DEL_CARRITO)`  
- **Body**:
  ```json
  [
      {
          "product": "(ID_DEL_PRODUCTO)",
          "quantity": 5
      },
      {
          "product": "(ID_DEL_PRODUCTO)",
          "quantity": 5
      }
  ]
  ```

### 🔄 Actualizar Cantidad de un Producto
- **Método**: `PUT`  
- **URL**: `http://localhost:8080/api/carts/(ID_DEL_CARRITO)/product/(ID_DEL_PRODUCTO)`  
- **Body**:
  ```json
  {
      "quantity": 150
  }
  ```

### 🗑️ Borrar Producto del Carrito
- **Método**: `DELETE`  
- **URL**: `http://localhost:8080/api/carts/(ID_DEL_CARRITO)/products/(ID_DEL_PRODUCTO)`

### 🗑️ Vaciar un Carrito
- **Método**: `DELETE`  
- **URL**: `http://localhost:8080/api/carts/(ID_DEL_CARRITO)`

### 🗑️ Borrar un Carrito
- **Método**: `DELETE`  
- **URL**: `http://localhost:8080/api/carts/remove/(ID_DEL_CARRITO)`

---

## 🛠️ Tecnologías Usadas

- **Backend**: Node.js, Express.js  
- **Base de Datos**: MongoDB  
- **Autenticación**: JWT  

---

## 📧 Contacto

Si tienes alguna duda o sugerencia, no dudes en contactarme:  
📧 **Email**: nicolasgemignani@outlook.com  

¡Gracias por utilizar esta API! 💻✨
