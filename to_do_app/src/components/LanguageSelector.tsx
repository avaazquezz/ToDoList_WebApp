import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${i18n.language?.startsWith('en') ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="Switch to English"
      >
        <img src="/public/flags/en.svg" alt="English" className="flag-icon" />
        English
      </button>
      <button
        className={`lang-btn ${i18n.language?.startsWith('es') ? 'active' : ''}`}
        onClick={() => changeLanguage('es')}
        aria-label="Cambiar a Español"
      >
        <img src="/public/flags/es.svg" alt="Español" className="flag-icon" />
        Español
      </button>
    </div>
  );
};

export default LanguageSelector;
