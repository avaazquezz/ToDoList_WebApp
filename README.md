<<<<<<< HEAD
# WorkToDo Web App
=======
# WorkToDo_WebApp
>>>>>>> 955ec6db6b5a2e725b52259c191c2bf567858a32

> **There's a lot of work to do:** turn the chaos of tasks into a clear, actionable roadmap with WorkToDo.

<!--ts-->
<<<<<<< HEAD

* [Project Description](#project-description)
* [Key Features](#key-features)
* [Technologies Used](#technologies-used)
* [Environment Setup](#environment-setup)

  * [Prerequisites](#prerequisites)
  * [Installation and Execution](#installation-and-execution)

    * [Using Docker](#using-docker)
    * [Using npm](#using-npm)
* [Project Structure](#project-structure)
* [🎥 Demo](#-demo)
* [Contributions](#contributions)
* [License](#license)

=======
  - [Project Description](#project-description)
  - [Key Features](#key-features)
  - [Technologies Used](#technologies-used)
  - [Environment Setup](#environment-setup)
    - [Prerequisites](#prerequisites)
    - [Installation and Execution](#installation-and-execution)
      - [Using Docker](#using-docker)
      - [Using npm](#using-npm)
  - [Project Structure](#project-structure)
  - [🎥 Demo](#-demo)
  - [Contributions](#contributions)
  - [License](#license)
>>>>>>> 955ec6db6b5a2e725b52259c191c2bf567858a32
<!--te-->

## Project Description

WorkToDo is a modern, responsive web application for seamless task and project management. It unifies an intuitive UI with robust functionality to streamline both personal and professional workflows.

## Key Features

* **Task Management** – Quickly create, edit, complete, and delete tasks.
* **Project Workspaces** – Group tasks into projects for high‑level oversight.
* **User Authentication** – Secure JWT‑based login & registration.
* **Dark‑Mode Interface** – Clean, accessible design that looks great on any device.
* **RESTful API Integration** – Frontend communicates effortlessly with the backend API.

## Technologies Used

### Frontend

* React 19.1.0 + TypeScript
* Vite
* React Router DOM

### Tooling & DevOps

* ESLint & Prettier
* Docker / Docker Compose

## Environment Setup

### Prerequisites

* Docker and Docker Compose **or** Node >= 20 & npm >= 10

### Installation and Execution

#### 1 · Clone the Repository

```bash
git clone https://github.com/avaazquezz/ToDoList_WebApp.git
cd ToDoList_WebApp/to-do-app
```

#### 2 · Build & Start with Docker

```bash
docker-compose up --build
```

The app will be live at **[http://localhost:3000](http://localhost:3000)**.

#### Using npm instead of Docker

```bash
npm install
npm run dev
```

### Backend API

The frontend expects a running API server. Clone and start the backend following its README:

```bash
git clone https://github.com/avaazquezz/WorkToDoApp_Backend.git
```

## Project Structure

```
to-do-app
├── docker-compose.yml
├── Dockerfile
├── vite.config.ts
├── public
│   └── favicon.ico
└── src
    ├── components
    │   └── NavBar.tsx
    ├── pages
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   └── RegisterPage.tsx
    ├── router
    │   └── AppRouter.tsx
    ├── styles
    │   ├── App.css
    │   └── HomePage.css
    ├── App.tsx
    └── main.tsx
```

## 🎥 Demo

Experience the live app here: **[https://worktodoapp.site/](https://worktodoapp.site/)**

## Contributions

Contributions are welcome! Please open an issue or submit a pull request.

## License

Distributed under the MIT License. See **LICENSE** for more information.
