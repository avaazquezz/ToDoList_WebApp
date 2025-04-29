import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/ProjectSectionPage.css';

// Definimos los colores disponibles
const COLORS = [
  { id: 'blue', value: '#1e88e5', name: 'Azul' },
  { id: 'green', value: '#4caf50', name: 'Verde' },
  { id: 'red', value: '#e53935', name: 'Rojo' },
  { id: 'purple', value: '#8e24aa', name: 'Morado' },
  { id: 'orange', value: '#ff9800', name: 'Naranja' },
  { id: 'teal', value: '#009688', name: 'Verde azulado' },
  { id: 'pink', value: '#e91e63', name: 'Rosa' },
  { id: 'brown', value: '#795548', name: 'Marrón' }
];

type Section = {
  idSection: number;
  title: string;
  text: string;
  color: string; // Añadimos el color a la sección
};

const ProjectSectionsPage = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionText, setNewSectionText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Decodificar el nombre del proyecto
  const decodedProjectName = projectName ? decodeURIComponent(projectName) : '';

  // Cargar secciones guardadas al iniciar
  useEffect(() => {
    const storedSections = JSON.parse(localStorage.getItem(`sections_${decodedProjectName}`) || '[]');
    setSections(storedSections);
  }, [decodedProjectName]);

  // Guardar secciones cuando cambien
  useEffect(() => {
    if (sections.length > 0 || localStorage.getItem(`sections_${decodedProjectName}`)) {
      localStorage.setItem(`sections_${decodedProjectName}`, JSON.stringify(sections));
    }
  }, [sections, decodedProjectName]);

  const addSection = () => {
    if (newSectionTitle.trim() === '' || newSectionText.trim() === '') {
      alert('El título y el texto de la sección no pueden estar vacíos.');
      return;
    }

    const newSection: Section = {
      idSection: Date.now(),
      title: newSectionTitle,
      text: newSectionText,
      color: selectedColor // Guardamos el color seleccionado
    };

    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setNewSectionText('');
    setSelectedColor(COLORS[0].value); // Reseteamos el color seleccionado
    setIsDialogOpen(false);
  };

  const deleteSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.idSection !== sectionId));
  };

  const deleteProject = () => {
    const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar el proyecto "${decodedProjectName}"?`);
    if (confirmDelete) {
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = storedProjects.filter((project: { name: string }) => project.name !== decodedProjectName);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      // También eliminar las secciones asociadas
      localStorage.removeItem(`sections_${decodedProjectName}`);

      alert(`El proyecto "${decodedProjectName}" ha sido eliminado.`);
      navigate('/home');
    }
  };

  return (
    <div className="project-page-container">
      <NavBar />
      
      <div className="project-main-content">
        <div className="project-top-btn">
          <button className="add-section-button" onClick={() => setIsDialogOpen(true)}>
            + Añadir Sección
          </button>
        </div>

        <div className="project-header">
          <h1>{decodedProjectName}</h1>
          <p>Aquí puedes añadir o eliminar secciones para organizar mejor tu proyecto!</p>
        </div>

        <div className="sections-list">
          {sections.length > 0 ? (
            <div className="section-cards">
              {sections.map((section) => (
                <div 
                  key={section.idSection} 
                  className="section-card"
                  style={{ backgroundColor: section.color }} // Aplicamos el color a la tarjeta
                >
                  <h3 className="section-title">{section.title}</h3>
                  <p className="section-text">{section.text}</p>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.idSection);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-sections">
              No hay secciones en este proyecto. ¡Añade tu primera sección!
            </div>
          )}
        </div>
        
        <div className="project-bottom-actions">
          <button 
            className="delete-project-button"
            onClick={deleteProject}
          >
            Eliminar Proyecto
          </button>
        </div>
      </div>

      {/* Diálogo para añadir sección con selección de color */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Añadir Nueva Sección</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSection();
              }}
            >
              <div className="form-group">
                <label htmlFor="section-title">Título</label>
                <input
                  id="section-title"
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Nombre de la sección"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="section-text">Texto</label>
                <textarea
                  id="section-text"
                  value={newSectionText}
                  onChange={(e) => setNewSectionText(e.target.value)}
                  placeholder="Describe el contenido de esta sección"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="color-selector-label">Selecciona un color:</label>
                <div className="color-selector">
                  {COLORS.map((color) => (
                    <div 
                      key={color.id}
                      className={`color-option color-${color.id} ${selectedColor === color.value ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="dialog-actions">
                <button type="submit" className="dialog-add-btn">Añadir</button>
                <button type="button" className="dialog-cancel-btn" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSectionsPage;