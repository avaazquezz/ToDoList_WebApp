import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/NavBar';
import AppRouter from './router/AppRouter';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <AppRouter />
    </Router>
  );
}

export default App;
