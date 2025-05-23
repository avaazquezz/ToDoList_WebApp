import { Link } from 'react-router-dom';
import '../styles/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <div className="hero-section">
        <h1>WorkToDo</h1>
        <p className="hero-text">Organiza tus proyectos. Simplifica tu vida.</p>
        <div className="hero-buttons">
          <Link to="/register" className="primary-button">Comienza Gratis</Link>
          <Link to="/login" className="secondary-button">Iniciar Sesión</Link>
        </div>
      </div>

      <section className="features-section">
        <h2>¿Por qué elegir WorkToDo?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Organización Simple</h3>
            <p>Gestiona tus tareas y proyectos de manera intuitiva con nuestra interfaz fácil de usar.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Sincronización</h3>
            <p>Accede a tus tareas desde cualquier dispositivo con sincronización en tiempo real.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Priorización</h3>
            <p>Establece prioridades y fechas límite para mantener tus proyectos en curso.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Seguimiento</h3>
            <p>Visualiza tu progreso y mantén un registro de las tareas completadas.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>Cómo Funciona</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Crea una cuenta</h3>
            <p>Regístrate en segundos y comienza a organizar tus tareas.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Añade proyectos</h3>
            <p>Crea proyectos y organízalos por categorías.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Gestiona tareas</h3>
            <p>Añade tareas, establece prioridades y plazos.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>¿Listo para empezar?</h2>
        <p>Únete a miles de usuarios que ya están organizando mejor sus vidas.</p>
        <Link to="/register" className="cta-button">Crear Cuenta Gratuita</Link>
      </section>
    </div>
  );
};

export default MainPage;