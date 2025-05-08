import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/About';
import ProjectSectionPage from '../pages/ProjectSectionPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/project/:projectName/sections" element={<ProjectSectionPage />} />
    </Routes>
  );
};

export default AppRouter;