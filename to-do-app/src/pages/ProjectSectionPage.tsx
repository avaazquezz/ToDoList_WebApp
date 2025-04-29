import { useParams } from 'react-router-dom';
import { useState } from 'react';
import NavBar from '../components/NavBar';
import '../styles/ProjectSectionPage.css';

type Section = {
  idSection: number;
  title: string;
  text: string;
};

const ProjectSectionsPage = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionText, setNewSectionText] = useState('');

  // Decodificar el nombre del proyecto
  const decodedProjectName = projectName ? decodeURIComponent(projectName) : '';

  const addSection = () => {
    if (newSectionTitle.trim() === '' || newSectionText.trim() === '') {
      alert('El título y el texto de la sección no pueden estar vacíos.');
      return;
    }

    const newSection: Section = {
      idSection: Date.now(),
      title: newSectionTitle,
      text: newSectionText,
    };

    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setNewSectionText('');
  };

  const deleteSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.idSection !== sectionId));
  };

  return (
    <div className="project-page">
      <NavBar />

      <div className="sidebar">
        <h2>Gestión de Secciones</h2>
        <div className="section-actions">
          <button className="add-section-btn" onClick={addSection}>
            Añadir Sección (+)
          </button>
          <button
            className="delete-section-btn"
            onClick={() => {
              if (sections.length > 0) {
                const lastSection = sections[sections.length - 1];
                deleteSection(lastSection.idSection);
              } else {
                alert('No hay secciones para eliminar.');
              }
            }}
          >
            Eliminar Última (-)
          </button>
        </div>
      </div>

      <div className="project-sections-container">
        <div className="project-header">
          <h1>{decodedProjectName}</h1>
          <p>Aquí puedes añadir o eliminar secciones para organizar mejor tu proyecto!</p>
        </div>

        <div className="sections-list">
          {sections.length > 0 ? (
            <ul>
              {sections.map((section) => (
                <li key={section.idSection} className="section-item">
                  <div className="section-content">
                    <h3 className="section-title">{section.title}</h3>
                    <p className="section-description">{section.text}</p>
                  </div>
                  <button
                    className="delete-section-btn"
                    onClick={() => deleteSection(section.idSection)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-sections">
              No hay secciones en este proyecto. ¡Añade tu primera sección!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSectionsPage;