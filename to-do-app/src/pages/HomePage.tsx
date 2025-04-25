import '../styles/HomePage.css';
import NavBar from '../components/NavBar';
import { useState } from 'react';

const HomePage = () => {
  // Estado para manejar la lista de proyectos
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);

  // Estado para manejar el nombre del nuevo proyecto
  const [newProjectName, setNewProjectName] = useState('');

  // Función para añadir un nuevo proyecto
  const addProject = () => {
    if (newProjectName.trim() === '') {
      alert('El nombre del proyecto no puede estar vacío.');
      return;
    }

    const newProject = {
      id: Date.now(), // Genera un ID único basado en la fecha actual
      name: newProjectName,
    };

    setProjects([...projects, newProject]); // Añade el nuevo proyecto a la lista
    setNewProjectName(''); // Limpia el campo de entrada
  };

  // Función para eliminar un proyecto
  const deleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div>
      <NavBar />

      <div className="home-page">
        <h2>Bienvenido a los mandos de control</h2>
        <p>Desde aquí vas a poder crear diferentes proyectos y así manejar todos tus frentes abiertos efectivamente.</p>
      </div>

      <div className="projects">
        <h2>Proyectos</h2>

        <div className="add-project">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button onClick={addProject}>Crear Proyecto</button>
        </div>

        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <span>{project.name}</span>
              <button onClick={() => deleteProject(project.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;