# ToDoList_WebApp

## Descripción del Proyecto
ToDoList_WebApp es una aplicación web diseñada para gestionar tareas y proyectos de manera eficiente. Este proyecto combina una interfaz moderna y responsiva con funcionalidades avanzadas para facilitar la organización personal y profesional.

### Características Principales
- **Gestión de Tareas**: Crea, edita y elimina tareas fácilmente.
- **Gestión de Proyectos**: Organiza tus tareas en proyectos.
- **Autenticación**: Inicio de sesión y registro de usuarios mediante Firebase.
- **Interfaz Moderna**: Diseño responsivo con un tema oscuro profesional.
- **Integración con API**: Comunicación fluida con el backend mediante Axios.

## Tecnologías Utilizadas
- **Frontend**:
  - React 19.1.0
  - TypeScript
  - Vite
  - React Router DOM
- **Herramientas de Desarrollo**:
  - ESLint
  - Vite.js
  - Docker

## Configuración del Entorno

### Requisitos Previos
- Node.js (versión 18 o superior)
- Docker (opcional, para ejecutar en contenedores)

### Instalación y Ejecución

#### 1. Clonar el Repositorio
```bash
$ git clone https://github.com/avaazquezz/ToDoList_WebApp.git
$ cd ToDoList_WebApp/to-do-app
```

#### 2. Instalar Dependencias
```bash
$ npm install
```

#### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:
```
VITE_API_URL=http://localhost:3001
```

#### 4. Ejecutar la Aplicación en Desarrollo
```bash
$ npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Uso con Docker
#### 1. Construir y Levantar el Contenedor
```bash
$ docker-compose up --build
```

#### 2. Acceder a la Aplicación
La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto
```
ToDoList_WebApp/
├── to-do-app/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── public/
│   │   ├── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── HomePage.css
│   │   ├── router/
│   │   │   ├── AppRouter.tsx
│   │   ├── main.tsx
│   │   ├── App.tsx
```

## 🎥 Demo en Video (WebM)

Aquí puedes ver una demostración rápida del funcionamiento de la aplicación:

👉 [Ver Video Demo](./assets/demo/demo.webm)



## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerir mejoras o reportar errores.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.