import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/MainPage.css';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const MainPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="main-container">
      {/* Selector de idioma arriba a la derecha solo en MainPage */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <LanguageSelector />
      </div>
      {/* Animated background particles */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="hero-title-container">
          <p className="hero-subtitle">
            {t('mainpage.subtitle', "Maybe there's a lot of")}
          </p>
          <h1>
            <span className="title-work">Work</span>
            <span className="title-to">To</span>
            <span className="title-do">Do</span>
          </h1>
        </div>
        <p className="hero-text">
          {t('mainpage.text', 'Transforma la manera en que organizas tu vida.')}
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="primary-button">
            <span>✨ {t('global.register')}</span>
          </Link>
          <Link to="/login" className="secondary-button">
            <span>🚀 {t('global.login')}</span>
          </Link>
        </div>
      </div>

      <section className="features-section">
        <h2>{t('mainpage.why', '¿Por qué elegir WorkToDo?')}</h2>
        <p className="section-description">
          {t('mainpage.whyDesc', 'Descubre las características que hacen de WorkToDo la herramienta perfecta para maximizar tu productividad y organizar tu vida de manera inteligente.')}
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>{t('mainpage.feature1.title', 'Organización Inteligente')}</h3>
            <p>{t('mainpage.feature1.desc', 'Sistema de gestión intuitivo que se adapta a tu flujo de trabajo. Organiza proyectos complejos con simplicidad elegante.')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>{t('mainpage.feature2.title', 'Sincronización Instantánea')}</h3>
            <p>{t('mainpage.feature2.desc', 'Acceso en tiempo real desde cualquier dispositivo. Tus datos siempre actualizados, sin importar dónde estés.')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>{t('mainpage.feature3.title', 'Productividad Maximizada')}</h3>
            <p>{t('mainpage.feature3.desc', 'Herramientas avanzadas de priorización y seguimiento que impulsan tu eficiencia hacia nuevos niveles.')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>{t('mainpage.feature4.title', 'Analytics Avanzados')}</h3>
            <p>{t('mainpage.feature4.desc', 'Insights detallados sobre tu rendimiento. Visualiza patrones, identifica mejoras y celebra tus logros.')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>{t('mainpage.feature5.title', 'Seguridad Premium')}</h3>
            <p>{t('mainpage.feature5.desc', 'Protección de datos de nivel empresarial. Tu información personal y proyectos completamente seguros.')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>{t('mainpage.feature6.title', 'Diseño Excepcional')}</h3>
            <p>{t('mainpage.feature6.desc', 'Interfaz moderna y minimalista diseñada para inspirar creatividad y mantener el foco en lo importante.')}</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>{t('mainpage.how', 'Cómo Funciona')}</h2>
        <p className="section-subtitle">
          {t('mainpage.howDesc', 'En solo 4 pasos simples, estarás en el camino hacia una productividad extraordinaria')}
        </p>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">🚀</div>
            <h3>{t('mainpage.step1.title', 'Registro Instantáneo')}</h3>
            <p className="step-description">
              <strong>{t('mainpage.step1.strong', '30 segundos para empezar.')}</strong> {t('mainpage.step1.desc', 'Solo necesitas tu email para acceder a todas las herramientas que transformarán tu productividad.')}
            </p>
            <div className="step-highlight">{t('mainpage.step1.highlight', 'Sin tarjetas de crédito • Sin compromisos')}</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">⚙️</div>
            <h3>{t('mainpage.step2.title', 'Configuración Inteligente')}</h3>
            <p className="step-description">
              <strong>{t('mainpage.step2.strong', 'Personaliza tu espacio.')}</strong> {t('mainpage.step2.desc', 'Crea proyectos, define categorías y establece el flujo de trabajo que mejor se adapte a tu estilo.')}
            </p>
            <div className="step-highlight">{t('mainpage.step2.highlight', 'Setup automático • Templates incluidos')}</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">✅</div>
            <h3>{t('mainpage.step3.title', 'Gestión Eficiente')}</h3>
            <p className="step-description">
              <strong>{t('mainpage.step3.strong', 'Organiza con inteligencia.')}</strong> {t('mainpage.step3.desc', 'Añade tareas, establece prioridades y fechas límite. Nuestro sistema te guía paso a paso.')}
            </p>
            <div className="step-highlight">{t('mainpage.step3.highlight', 'Priorización automática • Recordatorios inteligentes')}</div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">📈</div>
            <h3>{t('mainpage.step4.title', 'Resultados Extraordinarios')}</h3>
            <p className="step-description">
              <strong>{t('mainpage.step4.strong', 'Mide tu progreso.')}</strong> {t('mainpage.step4.desc', 'Observa cómo tu productividad se dispara mientras construyes hábitos que transforman tu vida.')}
            </p>
            <div className="step-highlight">{t('mainpage.step4.highlight', 'Analytics en tiempo real • Celebra tus logros')}</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="floating-particles"></div>
        <h2>{t('mainpage.ready', '¿Listo para comenzar?')}</h2>
        <p>{t('mainpage.cta', 'Únete gratis y transforma tu productividad hoy mismo.')}</p>
        <Link to="/register" className="cta-main-button">
          {t('global.register')}
        </Link>
      </section>
    </div>
  );
};

export default MainPage;