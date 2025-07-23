# ToDoList_WebApp

## Project Description
ToDoList_WebApp is a web application designed to efficiently manage tasks and projects. This project combines a modern and responsive interface with advanced features to facilitate personal and professional organization.

### Key Features
- **Task Management**: Easily create, edit, and delete tasks.
- **Project Management**: Organize your tasks into projects.
- **Authentication**: User login and registration via API.
- **Modern Interface**: Responsive design with a professional dark theme.
- **API Integration**: Seamless communication with the backend.

## Technologies Used
- **Frontend**:
  - React 19.1.0
  - TypeScript
  - Vite
  - React Router DOM
- **Development Tools**:
  - ESLint
  - Vite.js
  - Docker

## Environment Setup

### Prerequisites
- Docker (for running in containers)

### Installation and Execution

#### 1. Clone the Repository
```bash
$ git clone https://github.com/avaazquezz/ToDoList_WebApp.git
$ cd ToDoList_WebApp/to-do-app
```

#### 2. Build and Start the Container
```bash
$ docker-compose up --build
```

#### 3. Access the Application
The application will be available at `http://localhost:3000`.

### Important Note
To ensure the frontend works correctly, you must clone the backend repository and follow its setup instructions. The backend provides the API required for the frontend to function.

#### Backend Repository
```bash
$ git clone https://github.com/avaazquezz/WorkToDoApp_Backend.git
```
Follow the instructions in the backend repository to set up and run the API.

## Project Structure
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

## 🎥 Demo
Below are screenshots showcasing the MainPage, authentication features, HomePage, SectionsPage, and ToDoPage of the application:

### MainPage
- **Overview of the MainPage**:
  ![MainPage Screenshot 1](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/1.MainPage/MainPage1.png)
  ![MainPage Screenshot 2](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/1.MainPage/MainPage2.png)
  ![MainPage Screenshot 3](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/1.MainPage/MainPage3.png)
  ![MainPage Screenshot 4](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/1.MainPage/MainPage4.png)

### Authentication
- **User Authentication Screens**:
  ![Authentication Screenshot 1](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/2.authUser/Auth1.png)
  ![Authentication Screenshot 2](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/2.authUser/Auth2.png)

### HomePage
- **Overview of the HomePage**:
  ![HomePage Screenshot 1](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home1.png)
  ![HomePage Screenshot 2](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home2.png)
  ![HomePage Screenshot 3](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home3.png)
  ![HomePage Screenshot 4](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home4.png)
  ![HomePage Screenshot 5](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home5.png)
  ![HomePage Screenshot 6](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home6.png)
  ![HomePage Screenshot 7](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/3.HomePage/Home7.png)

### SectionsPage
- **Overview of the SectionsPage**:
  ![SectionsPage Screenshot 1](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/4.SectionsPage/Sec1.png)
  ![SectionsPage Screenshot 2](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/4.SectionsPage/Sec2.png)
  ![SectionsPage Screenshot 3](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/4.SectionsPage/Sec3.png)
  ![SectionsPage Screenshot 4](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/4.SectionsPage/Sec4.png)
  ![SectionsPage Screenshot 5](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/4.SectionsPage/Sec5.png)
  ![SectionsPage Screenshot 6](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/4.SectionsPage/Sec6.png)

### ToDoPage
- **Overview of the ToDoPage**:
  ![ToDoPage Screenshot 1](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo1.png)
  ![ToDoPage Screenshot 2](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo2.png)
  ![ToDoPage Screenshot 3](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo3.png)
  ![ToDoPage Screenshot 4](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo4.png)
  ![ToDoPage Screenshot 5](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo5.png)
  ![ToDoPage Screenshot 6](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo6.png)
  ![ToDoPage Screenshot 7](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo7.png)
  ![ToDoPage Screenshot 8](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo8.png)
  ![ToDoPage Screenshot 9](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo9.png)
  ![ToDoPage Screenshot 10](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo10.png)
  ![ToDoPage Screenshot 11](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo11.png)
  ![ToDoPage Screenshot 12](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo12.png)
  ![ToDoPage Screenshot 13](https://github.com/avaazquezz/ToDoList_WebApp/blob/main/to-do-app/src/assets/demo/5.ToDoPage/ToDo13.png)

## Contributions
Contributions are welcome. Please open an issue or submit a pull request to suggest improvements or report bugs.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.