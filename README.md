# 🚀 Sistema de Gestión de Usuarios y Tareas - Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=flat&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## 📖 Descripción

Sistema web moderno para la gestión integral de usuarios y tareas, desarrollado como proyecto del segundo parcial. La aplicación cuenta con autenticación de usuarios, gestión de roles (administrador/usuario) y un sistema completo de administración de tareas con funcionalidades avanzadas.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación**
- Login seguro con validación de credenciales
- Gestión de sesiones con tokens JWT
- Protección de rutas según roles de usuario

### 👥 **Gestión de Usuarios**
- Listado completo de usuarios registrados
- Búsqueda y filtrado dinámico por nombre, email y rol
- Creación y edición de perfiles de usuario
- Control granular de roles y permisos

### ✅ **Gestión de Tareas**
- Dashboard interactivo para visualización de tareas
- Creación, edición y eliminación de tareas
- Sistema de estados (pendiente, en progreso, completada)
- Filtros avanzados por estado, fecha y prioridad
- Generación de reportes descargables

### 🎨 **Interfaz de Usuario**
- Diseño responsive con Material Design 3
- Componentes modernos y accesibles
- Navegación intuitiva y fluida
- Tema consistente en toda la aplicación

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Vue.js** | 3.5.x | Framework JavaScript progresivo |
| **Vuetify** | 3.9.x | Framework de componentes Material Design |
| **TypeScript** | 5.8.x | Superset de JavaScript con tipado estático |
| **Vue Router** | 4.5.x | Enrutador oficial para Vue.js |
| **Axios** | 1.11.x | Cliente HTTP para consumo de APIs |
| **Pinia** | 3.0.x | Store pattern + biblioteca para Vue.js |
| **Vite** | 7.1.x | Herramienta de construcción y desarrollo |

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/ManuelGrijalva/Parcial2Frontend.git
cd Parcial2Frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:
```env
# URL del API Backend
VITE_API_URL=http://127.0.0.1:8000/api

# Configuraciones adicionales (opcional)
VITE_APP_NAME=Sistema de Gestión UMG
VITE_APP_VERSION=1.0.0
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Acceder a la aplicación**
Abrir navegador en: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── 📁 components/           # Componentes reutilizables
│   ├── HelloWorld.vue      # Componente de bienvenida
│   └── TareasList.vue      # Lista de tareas
├── 📁 views/               # Vistas principales
│   ├── HomeView.vue        # Dashboard principal
│   ├── LoginView.vue       # Página de autenticación
│   ├── TareasView.vue      # Gestión de tareas
│   ├── UserForm.vue        # Formulario de usuarios
│   └── UsersList.vue       # Lista de usuarios
├── 📁 services/            # Servicios y APIs
│   └── api.ts             # Configuración de Axios y endpoints
├── 📁 router/              # Configuración de rutas
│   └── index.ts           # Definición de rutas y guards
├── 📁 plugins/             # Plugins de Vue
│   └── vuetify.ts         # Configuración de Vuetify
└── 📁 assets/              # Recursos estáticos
```

## 🔌 API Endpoints

La aplicación consume los siguientes endpoints del backend:

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión

### Gestión de Usuarios
- `GET /api/usuarios/listUsers` - Listar todos los usuarios
- `POST /api/usuarios/addUser` - Crear nuevo usuario
- `GET /api/usuarios/getUser/{id}` - Obtener usuario específico
- `PUT /api/usuarios/updateUser/{id}` - Actualizar usuario
- `DELETE /api/usuarios/deleteUser/{id}` - Eliminar usuario

### Gestión de Tareas
- `GET /api/tareas` - Listar todas las tareas
- `POST /api/tareas` - Crear nueva tarea
- `PUT /api/tareas/{id}` - Actualizar tarea
- `DELETE /api/tareas/{id}` - Eliminar tarea
- `GET /api/tareas/reporte` - Generar reporte de tareas

## 👤 Roles y Funcionalidades

### 🔑 **Administrador**
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Visualización de todos los usuarios del sistema
- ✅ Asignación y modificación de roles
- ✅ Acceso a reportes y estadísticas
- ✅ Gestión completa de tareas

### 👨‍💼 **Usuario**
- ✅ Visualización de lista de usuarios
- ✅ Gestión de sus propias tareas
- ✅ Búsqueda y filtrado de información
- ✅ Actualización de perfil personal

## 🎯 Guía de Uso

### Inicio de Sesión
1. Acceder a la URL de la aplicación
2. Ingresar credenciales (email y contraseña)
3. El sistema redirigirá al dashboard principal

### Gestión de Usuarios (Solo Administradores)
1. Navegar a la sección "Usuarios"
2. Usar la barra de búsqueda para filtrar usuarios
3. Hacer clic en "Agregar Usuario" para crear nuevos usuarios
4. Usar las acciones de la tabla para editar o eliminar

### Gestión de Tareas
1. Acceder a la vista "Tareas"
2. Usar el sidebar para agregar nuevas tareas
3. Filtrar tareas por estado o fecha
4. Generar reportes usando el botón "Descargar Reporte"

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot-reload

# Producción
npm run build            # Construir para producción
npm run preview          # Vista previa del build de producción

# Utilidades
npm run type-check       # Verificar tipos de TypeScript
npm run lint             # Ejecutar linter
```

## 🌐 Configuración de Producción

Para desplegar en producción:

1. **Construir la aplicación**
```bash
npm run build
```

2. **Configurar variables de entorno de producción**
```env
VITE_API_URL=https://tu-api-produccion.com/api
```

3. **Desplegar la carpeta `dist/` en tu servidor web**

## 📝 Notas de Desarrollo

- La aplicación utiliza **Composition API** de Vue 3
- Todos los componentes están tipados con **TypeScript**
- Se sigue la guía de estilo oficial de Vue.js
- Responsive design implementado con Vuetify grid system
- Manejo de estados globales con Pinia

## 🤝 Contribución

Este proyecto fue desarrollado como parte del segundo parcial de la materia. Para contribuir:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📧 Contacto

**Autor:** Manuel Grijalva  
**Institución:** Universidad Mariano Gálvez de Guatemala  
**Materia:** [Nombre de la materia]  
**Año:** 2025

---

*Desarrollado con ❤️ para el segundo parcial - UMG 2025*
