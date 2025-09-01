import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="11" width="6" height="11"/>
                <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 21.02L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 2Z"/>
              </svg>
              <span className="footer-title">{t('footer.brand')}</span>
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Developer Section */}
          <div className="footer-developer">
            <h4 className="footer-section-title">{t('footer.developer.title')}</h4>
            <div className="developer-info">
              <h5 className="developer-name">{t('footer.developer.name')}</h5>
              <p className="developer-role">{t('footer.developer.role')}</p>
              <p className="developer-description">{t('footer.developer.description')}</p>
            </div>
            <div className="footer-links">
              <a 
                href="https://www.vazquezdev.pro/" 
                className="footer-link"
                aria-label={t('footer.links.portfolio')}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {t('footer.links.portfolio')}
              </a>
              <a 
                href="https://github.com/avaazquezz" 
                className="footer-link"
                aria-label={t('footer.links.github')}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                {t('footer.links.github')}
              </a>
              <a 
                href="https://www.linkedin.com/in/adrivaz/" 
                className="footer-link"
                aria-label={t('footer.links.linkedin')}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                {t('footer.links.linkedin')}
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-left">
              <p className="footer-copyright">{t('footer.copyright')}</p>
              <p className="footer-made-with">{t('footer.madeWith')}</p>
            </div>
            <div className="footer-tech">
              <span className="tech-badge">{t('footer.technologies.react')}</span>
              <span className="tech-badge">{t('footer.technologies.typescript')}</span>
              <span className="tech-badge">{t('footer.technologies.vite')}</span>
              <span className="tech-badge">{t('footer.technologies.css')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
