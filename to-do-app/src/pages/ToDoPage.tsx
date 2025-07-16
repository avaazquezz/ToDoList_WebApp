import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const ToDoPage: React.FC = () => {
  const { projectName, sectionId } = useParams<{ projectName: string; sectionId: string }>();
  const location = useLocation();
  const sectionName = location.state?.sectionName || ''; // Use section name from state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionName) {
      setError('No se pudo obtener el nombre de la sección desde el estado.');
    }
  }, [sectionName]);

  return (
    <div>
      <p>Proyecto: <strong>{projectName}</strong></p>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <p>Sección: <strong>{sectionName}</strong></p>
      )}
      <p>Aquí se mostrarán las tareas de la sección seleccionada.</p>
    </div>
  );
};

export default ToDoPage;