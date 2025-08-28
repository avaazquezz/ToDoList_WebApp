import React, { useState, useEffect } from 'react';
import '../styles/EditProjectModal.css';

interface Project {
  id: number;
  name: string;
  color: string;
  description: string;
  createdBy: string;
  createdAt: number;
}

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (projectData: { name: string; color: string; description: string }) => void;
}

const colorOptions = [
  '#4a90e2', '#50c878', '#f39c12', '#e74c3c', '#9b59b6',
  '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#c0392b'
];

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description || '');
      setSelectedColor(project.color);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        name: projectName.trim(),
        description: projectDescription.trim(),
        color: selectedColor
      });
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setProjectName('');
    setProjectDescription('');
    setSelectedColor(colorOptions[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-project-modal-overlay" onClick={handleClose}>
      <div className="edit-project-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Editar Proyecto</h2>
          <p className="modal-subtitle">Modifica los detalles de tu proyecto</p>
          <button
            className="modal-close-button"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            {/* Project Name */}
            <div className="form-group">
              <label htmlFor="projectName" className="form-label">
                Nombre del proyecto
              </label>
              <input
                id="projectName"
                type="text"
                className="form-input"
                placeholder="Ingresa el nombre del proyecto"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                maxLength={50}
                required
              />
              <div className="input-helper">{projectName.length}/50</div>
            </div>

            {/* Project Description */}
            <div className="form-group">
              <label htmlFor="projectDescription" className="form-label">
                Descripción del proyecto
              </label>
              <textarea
                id="projectDescription"
                className="form-textarea"
                placeholder="Describe tu proyecto (opcional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                maxLength={200}
                rows={3}
              />
              <div className="input-helper">{projectDescription.length}/200</div>
            </div>

            {/* Color Selection */}
            <div className="form-group">
              <label className="form-label">Color del proyecto</label>
              <div className="color-grid">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Seleccionar color ${color}`}
                  >
                    {selectedColor === color && (
                      <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="button-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`button-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading || !projectName.trim()}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
