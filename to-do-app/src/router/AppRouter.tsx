import { Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage';
import About from '../pages/About';
import Main from '../pages/MainPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRouter;