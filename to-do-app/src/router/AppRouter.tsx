import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/About';
import ProjectTasksPage from '../pages/ProjectTasksPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* Cambiamos projectId por projectName */}
      <Route path="/project/:projectName" element={<ProjectTasksPage />} />
    </Routes>
  );
};

export default AppRouter;