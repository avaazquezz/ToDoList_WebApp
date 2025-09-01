
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import './styles/App.css';
import { useTranslation } from 'react-i18next';


function App() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Router>
  {/* Selector de idioma eliminado, se agregará solo en Main, Login y Register */}
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
