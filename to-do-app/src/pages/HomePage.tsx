import '../styles/HomePage.css';
import NavBar from '../components/NavBar';
import { useState } from 'react';

// Definir un tipo para los proyectos que incluya color
type Project = {
  id: number;
  name: string;
  color: string;
};

// Array de colores predefinidos para elegir
const colorOptions = [
  '#4a90e2', // azul
  '#50c878', // verde
  '#f39c12', // naranja
  '#e74c3c', // rojo
  '#9b59b6', // morado
  '#3498db', // azul claro
  '#2ecc71', // verde claro
  '#f1c40f', // amarillo
  '#e67e22', // naranja oscuro
  '#c0392b'  // rojo oscuro
];

const HomePage = () => {
  // Estado para manejar la lista de proyectos
  const [projects, setProjects] = useState<Project[]>([]);

  // Estado para manejar el nombre del nuevo proyecto
  const [newProjectName, setNewProjectName] = useState('');
  
  // Estado para manejar el color seleccionado
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  
  // Estado para mostrar/ocultar el selector de colores
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Función para añadir un nuevo proyecto
  const addProject = () => {
    if (newProjectName.trim() === '') {
      alert('El nombre del proyecto no puede estar vacío.');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      color: selectedColor
    };

    setProjects([...projects, newProject]); 
    setNewProjectName('');
    // Resetear el color al predeterminado después de crear
    setSelectedColor(colorOptions[0]);
    setShowColorPicker(false);
  };

  // Función para manejar tecla Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addProject();
    }
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
            onKeyPress={handleKeyPress}
          />
          
          <div className="color-selector-container">
            <div 
              className="color-preview" 
              style={{ backgroundColor: selectedColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            ></div>
            
            {showColorPicker && (
              <div className="color-picker">
                {colorOptions.map((color) => (
                  <div 
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
          
          <button onClick={addProject}>Crear</button>
        </div>

        <ul className="project-list">
          {projects.map((project) => (
            <li 
              key={project.id} 
              className="project-item"
              style={{ backgroundColor: project.color }}
            >
              <span>{project.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;