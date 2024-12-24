# Prueba_Movistar
 Prueba tecnica para plaza de movistar

## 🚀 Funcionalidades

### Empleado
- **Crear:** Crear el empleado con los campos requeridos en el formulario.
- **Visualizar:** Listado de empleados con opciones de busqueda y filtrado
- **Editar:** Editar empleado del sistema
- **Eliminar:** Eliminar empleado del sistema

### Cliente
- **Crear:** Crear el cliente con los campos requeridos en el formulario.
- **Visualizar:** Listado de clientes con opciones de busqueda y filtrado
- **Editar:** Editar cliente del sistema
- **Eliminar:** desactivar cliente del sistema
- **Log de cambios:** muestra los diferentes cambios que ha recibido

### Autentificación
- **Inicio de sesión:** Sistema cuenta con autentificación ademas de restringir por rol los accesos.

### Reporteria
- **Reporte de clientes :** Reporte que muestra la información de todos los clientes o de un cliente si asi se requiere generando en archivo xlsx.

---

## 📄 Requerimientos
- **Tener instalado Node**:
- **Tener instalado Composer**
- **Contar con una version superior de PHP a la 8.1 de preferencia instalar XAMPP**

---

## 🛠️ Tecnologías Utilizadas
- **Version de PHP**: 8.1 o mayor
- **Backend**: Laravel.
- **Base de Datos**: MySQL.
- **Frontend**: React.

---

## ⚙️ Configuración del Proyecto
## Laravel

### 1️⃣ Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

### 2️⃣ Crear base de datos
Acceder a la base de datos y crear una base que se llame movistar_prueba

### 3️⃣ Crear y configurar variables de entorno
-Acceder primero a la carpeta laravel-api-app
-Luego abrir una terminal para poder crear la variable de entorno
```bash
cp .env.example .env
```
-Esto creara una copia del env en la raiz del proyecto en el cual configuraremos las variables 
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=movistar_prueba
DB_USERNAME=root
DB_PASSWORD=
```
Estas pueden variar dependiendo la configuración de nuestra base de datos.

### 4️⃣ Instalacion de los componentes para correr la API 
```bash
Composer installer
```

### 5️⃣ Migrar la base de datos y crear usuario administrador
```bash
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
```
### 6️⃣ Iniciar el servidor
```bash
php artisan serve
```

## React
### 1️⃣ Instalar todas las dependencias
Primero debemos asegurarnos de estar en la carpeta react_prueba_tecnica y abrir una terminal
```bash
npm install
```

### 2️⃣ Configuración de API
Cuando ejecutas php artisan serve, puede que el servidor inicie en una ruta diferente, por ejemplo, http://127.0.0.1:8001 o incluso una dirección de red local como http://192.168.x.x:8000. En esos casos, debes actualizar el archivo vite.config.js para que apunte correctamente al servidor backend
```bash
        target: 'http://127.0.0.1:8000',
```

### 3️⃣ Iniciar el servidor
```bash
npm run dev
```

### 4️⃣ Usuario para ingresar y contraseña
- **Correo:** admin@gmail.com
- **Contraseña:** 1234
