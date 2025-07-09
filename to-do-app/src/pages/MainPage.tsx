import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/MainPage.css';

const MainPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="main-container">
      {/* Animated background particles */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <h1>
          <span className="title-work">Work</span>
          <span className="title-to">To</span>
          <span className="title-do">Do</span>
        </h1>
        <p className="hero-text">
          Transforma la manera en que organizas tu vida. 
          <br />
          <strong>Simplicidad. Elegancia. Productividad.</strong>
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="primary-button">
            <span>✨ Comienza Gratis</span>
          </Link>
          <Link to="/login" className="secondary-button">
            <span>🚀 Iniciar Sesión</span>
          </Link>
        </div>
      </div>

      <section className="features-section">
        <h2>¿Por qué elegir WorkToDo?</h2>
        <p className="section-description">
          Descubre las características que hacen de WorkToDo la herramienta perfecta para maximizar tu productividad y organizar tu vida de manera inteligente.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Organización Inteligente</h3>
            <p>Sistema de gestión intuitivo que se adapta a tu flujo de trabajo. Organiza proyectos complejos con simplicidad elegante.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Sincronización Instantánea</h3>
            <p>Acceso en tiempo real desde cualquier dispositivo. Tus datos siempre actualizados, sin importar dónde estés.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Productividad Maximizada</h3>
            <p>Herramientas avanzadas de priorización y seguimiento que impulsan tu eficiencia hacia nuevos niveles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Avanzados</h3>
            <p>Insights detallados sobre tu rendimiento. Visualiza patrones, identifica mejoras y celebra tus logros.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">�</div>
            <h3>Seguridad Premium</h3>
            <p>Protección de datos de nivel empresarial. Tu información personal y proyectos completamente seguros.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Diseño Excepcional</h3>
            <p>Interfaz moderna y minimalista diseñada para inspirar creatividad y mantener el foco en lo importante.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>Cómo Funciona</h2>
        <p className="section-subtitle">
          En solo 4 pasos simples, estarás en el camino hacia una productividad extraordinaria
        </p>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">🚀</div>
            <h3>Registro Instantáneo</h3>
            <p className="step-description">
              <strong>30 segundos para empezar.</strong> Solo necesitas tu email para acceder a todas las herramientas que transformarán tu productividad.
            </p>
            <div className="step-highlight">Sin tarjetas de crédito • Sin compromisos</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">⚙️</div>
            <h3>Configuración Inteligente</h3>
            <p className="step-description">
              <strong>Personaliza tu espacio.</strong> Crea proyectos, define categorías y establece el flujo de trabajo que mejor se adapte a tu estilo.
            </p>
            <div className="step-highlight">Setup automático • Templates incluidos</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">✅</div>
            <h3>Gestión Eficiente</h3>
            <p className="step-description">
              <strong>Organiza con inteligencia.</strong> Añade tareas, establece prioridades y fechas límite. Nuestro sistema te guía paso a paso.
            </p>
            <div className="step-highlight">Priorización automática • Recordatorios inteligentes</div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">📈</div>
            <h3>Resultados Extraordinarios</h3>
            <p className="step-description">
              <strong>Mide tu progreso.</strong> Observa cómo tu productividad se dispara mientras construyes hábitos que transforman tu vida.
            </p>
            <div className="step-highlight">Analytics en tiempo real • Celebra tus logros</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="floating-particles"></div>
        <h2>¿Listo para comenzar?</h2>
        <p>Únete gratis y transforma tu productividad hoy mismo.</p>
        <Link to="/register" className="cta-main-button">
          Comenzar Gratis
        </Link>
      </section>
    </div>
  );
};

export default MainPage;