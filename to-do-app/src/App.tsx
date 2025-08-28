import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AppRouter />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName="toast-container"
      />
    </Router>
  );
}

export default App;
