import '../styles/MainPage.css';

const MainPage = () => {
  
  return (
    <div className="main-container">
      <h1>Bienvenido a WorkToDo</h1>
      
      <section className="app-intro">
        <p>La aplicación perfecta para gestionar tus tareas diarias.</p>
        
      </section>
      
      <div className="cta-container">
        <button 
          className="start-button"
          onClick={() => window.location.href = '/home'}
        >
          Comienza a usar WorkToDo
        </button>
      </div>

      <section className="features">
        <h2>Características</h2>
        <ul>
          <li>Crea y organiza tareas fácilmente</li>
          <li>Establece prioridades</li>
          <li>Marca tareas como completadas</li>
          <li>Visualiza tu progreso</li>
        </ul>
      </section>
      
     
    </div>
  );
};
  
export default MainPage;