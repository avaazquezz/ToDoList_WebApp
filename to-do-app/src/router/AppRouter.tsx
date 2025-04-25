import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/About';
import ProjectSectionPage from '../pages/ProjectSectionPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/project/:projectName/sections" element={<ProjectSectionPage />} />
    </Routes>
  );
};

export default AppRouter;