
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css';
import WorkToDoLogo from '../assets/WorkToDo_logo.png';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div 
        className="nav-brand" 
        onClick={() => navigate('/')}
      >
        <img src={WorkToDoLogo} alt="WorkToDo Logo" className="nav-logo" />
      </div>

      <div className="nav-menu">
        <button 
          className="back-to-home-button" 
          onClick={() => navigate('/home')}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {t('global.home')}
        </button>

        <button 
          className="back-to-home-button" 
          onClick={() => navigate('/home')}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
            {t('global.project')}
        </button>

        {location.pathname.includes('/todos') && (
          <button 
            className="back-to-home-button" 
            onClick={() => navigate(`/project/${location.pathname.split('/')[2]}/sections`)}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {t('global.section')}
          </button>
        )}

        <div className="settings-button" onClick={toggleDropdown}>
          <svg
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>{t('global.about')}</span>
          <div className={`dropdown-menu ${dropdownVisible ? 'visible' : ''}`}>
            <div className="dropdown-section language-section">
              <div className="language-title">{t('global.language') || 'Language'}</div>
              <div className="language-options">
                <button
                  type="button"
                  className={`lang-btn ${i18n.language?.startsWith('en') ? 'active' : ''}`}
                  onClick={() => i18n.changeLanguage('en')}
                  aria-label="Switch to English"
                >
                  {t('global.english') || 'EN'}
                </button>
                <button
                  type="button"
                  className={`lang-btn ${i18n.language?.startsWith('es') ? 'active' : ''}`}
                  onClick={() => i18n.changeLanguage('es')}
                  aria-label="Cambiar a Español"
                >
                  {t('global.spanish') || 'ES'}
                </button>
              </div>
            </div>
            <div className="dropdown-section">
              <button onClick={handleLogout} className="logout-button">{t('global.logout')}</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;