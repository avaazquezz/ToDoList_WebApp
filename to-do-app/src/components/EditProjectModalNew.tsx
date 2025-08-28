import React, { useState, useEffect } from 'react';
import '../styles/ProjectSectionPage.css';

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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Editar Proyecto</h2>
          <p className="modal-subtitle">Modifica los detalles de tu proyecto</p>
        </div>

        {/* Project Name */}
        <div className="form-group">
          <label htmlFor="projectName">Nombre del proyecto</label>
          <input
            id="projectName"
            type="text"
            placeholder="Ingresa el nombre del proyecto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            maxLength={50}
            required
          />
        </div>

        {/* Project Description */}
        <div className="form-group">
          <label htmlFor="projectDescription">Descripción del proyecto</label>
          <textarea
            id="projectDescription"
            placeholder="Describe tu proyecto (opcional)"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            maxLength={200}
            rows={3}
          />
        </div>

        {/* Color Selection */}
        <div className="form-group">
          <label>Color del proyecto</label>
          <div className="color-options">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Seleccionar color ${color}`}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn cancel-button"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="modal-btn create-button"
            onClick={handleSubmit}
            disabled={isLoading || !projectName.trim()}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
