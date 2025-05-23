import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/ProjectSectionPage.css';

// Función para ajustar el color y crear el degradado
const adjustColor = (color: string, amount: number): string => {
  return '#' + color.replace(/^#/, '').replace(/([a-f\d]{2})/gi, (_, c) => {
    const value = Math.min(Math.max(parseInt(c, 16) + amount, 0), 255);
    return value.toString(16).padStart(2, '0');
  });
};

const COLORS = [
  { id: 'blue', value: '#3b82f6', name: 'Azul', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  { id: 'green', value: '#10b981', name: 'Verde', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { id: 'red', value: '#ef4444', name: 'Rojo', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
  { id: 'purple', value: '#8b5cf6', name: 'Morado', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
  { id: 'orange', value: '#f97316', name: 'Naranja', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
  { id: 'teal', value: '#14b8a6', name: 'Verde azulado', gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' },
  { id: 'pink', value: '#ec4899', name: 'Rosa', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
  { id: 'indigo', value: '#6366f1', name: 'Índigo', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }
];

interface Section {
  idSection: number;
  title: string;
  text: string;
  color: string;
  createdAt: number;
  gradient?: string;
}

interface Project {
  id: number;
  name: string;
  color: string;
  createdBy: string;
  createdAt: number;
}

const ProjectSectionsPage = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionText, setNewSectionText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [projectColor, setProjectColor] = useState('');
  const navigate = useNavigate();

  const decodedProjectName = projectName ? decodeURIComponent(projectName) : '';

  // Cargar color del proyecto
  useEffect(() => {
    if (!decodedProjectName) return;
    
    try {
      const storedProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
      const currentProject = storedProjects.find(p => p.name === decodedProjectName);
      console.log('Current project:', currentProject); // Para depuración
      if (currentProject?.color) {
        setProjectColor(currentProject.color);
      }
    } catch (error) {
      console.error('Error al cargar el color del proyecto:', error);
    }
  }, [decodedProjectName]);

  // Cargar secciones guardadas al iniciar
  useEffect(() => {
    if (!decodedProjectName) return;

    try {
      const storedSections = JSON.parse(localStorage.getItem(`sections_${decodedProjectName}`) || '[]');
      if (Array.isArray(storedSections)) {
        setSections(storedSections);
      } else {
        setSections([]);
      }
    } catch {
      setSections([]);
    }
  }, [decodedProjectName]);

  // Guardar secciones cuando cambien
  useEffect(() => {
    if (!decodedProjectName || sections.length === 0) return;
    localStorage.setItem(`sections_${decodedProjectName}`, JSON.stringify(sections));
  }, [sections, decodedProjectName]);

  // Ordenar secciones por fecha de creación
  const sortedSections = [...sections].sort((a, b) => b.createdAt - a.createdAt);

  const closeModal = () => {
    setIsDialogOpen(false);
    setEditingSection(null);
    setNewSectionTitle('');
    setNewSectionText('');
    setSelectedColor(COLORS[0].value);
  };

  const addOrUpdateSection = () => {
    if (newSectionTitle.trim() === '' || newSectionText.trim() === '') {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const selectedColorObj = COLORS.find(c => c.value === selectedColor);
    
    if (editingSection) {
      // Actualizar sección existente
      setSections(prev => prev.map(section => 
        section.idSection === editingSection.idSection 
          ? {
              ...section,
              title: newSectionTitle,
              text: newSectionText,
              color: selectedColor,
              gradient: selectedColorObj?.gradient
            }
          : section
      ));
    } else {
      // Crear nueva sección
      const newSection: Section = {
        idSection: Date.now(),
        title: newSectionTitle,
        text: newSectionText,
        color: selectedColor,
        gradient: selectedColorObj?.gradient,
        createdAt: Date.now()
      };
      setSections(prev => [...prev, newSection]);
    }

    closeModal();
  };

  const editSection = (section: Section) => {
    setEditingSection(section);
    setNewSectionTitle(section.title);
    setNewSectionText(section.text);
    setSelectedColor(section.color);
    setIsDialogOpen(true);
  };

  const deleteSection = (sectionId: number) => {
    const sectionToDelete = sections.find(s => s.idSection === sectionId);
    if (sectionToDelete && window.confirm(`¿Estás seguro de que deseas eliminar la sección "${sectionToDelete.title}"?`)) {
      setSections(prev => prev.filter(section => section.idSection !== sectionId));
    }
  };

  const deleteProject = () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro que deseas eliminar el proyecto "${decodedProjectName}"?\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = storedProjects.filter(
        (project: { name: string }) => project.name !== decodedProjectName
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      localStorage.removeItem(`sections_${decodedProjectName}`);
      navigate('/home');
    }
  };

  return (
    <div className="project-page-container">
      <NavBar />
      
      <div className="project-main-content">
        <div 
          className="project-header"
          style={{
            background: projectColor 
              ? `linear-gradient(135deg, ${projectColor}, ${adjustColor(projectColor, -30)})`
              : 'var(--gradient-primary)',
            transition: 'background 0.3s ease'
          }}
        >
          <h1>{decodedProjectName}</h1>
          <p>Organiza tu proyecto en secciones para una mejor gestión de tareas</p>
          
          <div className="project-top-btn">
            <button 
              className="add-section-button"
              onClick={() => setIsDialogOpen(true)}
              aria-label="Crear nueva sección"
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
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nueva Sección
            </button>
          </div>
        </div>

        <div className="sections-list">
          {sortedSections.length > 0 ? (
            <div className="section-cards">
              {sortedSections.map((section) => (
                <div 
                  key={section.idSection} 
                  className="section-card"                  style={{ 
                    background: `linear-gradient(to bottom right, ${section.color}15, ${section.color}08)`,
                    borderColor: `${section.color}30`,
                    '--project-color': projectColor || 'var(--primary-color)'
                  } as React.CSSProperties}
                  role="article"
                  aria-labelledby={"section-title-" + section.idSection}
                >
                  <h3 
                    className="section-title"
                    id={"section-title-" + section.idSection}
                  >
                    {section.title}
                  </h3>
                  <p className="section-text">{section.text}</p>
                  
                  <div className="section-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => editSection(section)}
                      aria-label={"Editar sección " + section.title}
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.idSection);
                      }}
                      aria-label={"Eliminar sección " + section.title}
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-sections" role="status">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <p>No hay secciones en este proyecto.</p>
              <p>¡Comienza creando tu primera sección!</p>
            </div>
          )}
        </div>
        
        <div className="project-bottom-actions">
          <button
            className="delete-project-button"
            onClick={deleteProject}
            aria-label={"Eliminar proyecto " + decodedProjectName}
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
              style={{ marginRight: '0.5rem' }}
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Eliminar Proyecto
          </button>
        </div>

        {isDialogOpen && (
          <div 
            className="modal-overlay"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div 
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 id="modal-title" className="modal-title">
                  {editingSection ? 'Editar Sección' : 'Nueva Sección'}
                </h2>
                <p className="modal-subtitle">
                  {editingSection 
                    ? 'Modifica los detalles de la sección'
                    : 'Crea una nueva sección para organizar tus tareas'
                  }
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="sectionTitle">Título</label>
                <input
                  type="text"
                  id="sectionTitle"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Escribe un título descriptivo"
                  maxLength={50}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sectionText">Descripción</label>
                <textarea
                  id="sectionText"
                  value={newSectionText}
                  onChange={(e) => setNewSectionText(e.target.value)}
                  placeholder="Describe el propósito de esta sección"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label>Color de la sección</label>
                <div className="color-options">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      className={"color-option " + (selectedColor === color.value ? 'selected' : '')}
                      style={{ background: color.gradient }}
                      onClick={() => setSelectedColor(color.value)}
                      aria-label={"Color " + color.name}
                      aria-pressed={selectedColor === color.value}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn cancel-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  className="modal-btn create-button"
                  onClick={addOrUpdateSection}
                  disabled={!newSectionTitle.trim() || !newSectionText.trim()}
                >
                  {editingSection ? 'Guardar Cambios' : 'Crear Sección'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSectionsPage;