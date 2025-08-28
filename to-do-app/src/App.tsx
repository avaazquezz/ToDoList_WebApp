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
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Configuración global
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          },
          // Configuración para notificaciones de éxito
          success: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          // Configuración para notificaciones de error
          error: {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          // Configuración para notificaciones de loading
          loading: {
            style: {
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              color: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
