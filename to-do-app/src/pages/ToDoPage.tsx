import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/ToDoPage.css';
import NavBar from '../components/NavBar';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Note {
  id: number;
  title: string;
  todos: Todo[];
}

interface Todo {
  id: number;
  content: string;
  is_completed: boolean;
}

const ToDoPage: React.FC = () => {
  const { projectName, sectionId } = useParams<{ projectName: string; sectionId: string }>();
  const location = useLocation();
  const sectionName = location.state?.sectionName || ''; // Use section name from state

  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionName) {
      setError('No se pudo obtener el nombre de la sección desde el estado.');
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notes/section/${sectionId}`);
        if (!response.ok) {
          throw new Error('Error al obtener las notas');
        }
        const data = await response.json();
        
        // Fetch todos for each note
        const notesWithTodos = await Promise.all(
          data.map(async (note: any) => {
            const todosResponse = await fetch(`${API_BASE_URL}/notes/${note.id}/todos`);
            const todos = todosResponse.ok ? await todosResponse.json() : [];
            return { ...note, todos };
          })
        );
        
        setNotes(notesWithTodos);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchNotes();
  }, [sectionId, sectionName]);

  const createNote = async () => {
    if (!newNoteTitle.trim()) return;
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNoteTitle,
          section_id: sectionId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la nota');
      }

      const data = await response.json();
      const newNote = {
        id: data.noteId,
        title: newNoteTitle,
        todos: [],
      };

      setNotes(prev => [...prev, newNote]);
      setNewNoteTitle('');
      setIsCreatingNote(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addTodo = async (noteId: number, content: string) => {
    if (!content.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir el ToDo');
      }

      // Refresh todos for this note
      const todosResponse = await fetch(`${API_BASE_URL}/notes/${noteId}/todos`);
      const todos = await todosResponse.json();

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, todos } : note
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleTodo = async (todoId: number, currentStatus: boolean, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          is_completed: !currentStatus 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el ToDo');
      }

      setNotes(prevNotes =>
        prevNotes.map(note => ({
          ...note,
          todos: note.todos.map(todo =>
            todo.id === todoId ? { ...todo, is_completed: !currentStatus } : todo
          )
        }))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const saveNote = async (noteId: number, title: string) => {
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la nota');
      }

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, title } : note
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta nota?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la nota');
      }

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEditingNote = (noteId: number) => {
    setEditingNoteId(noteId);
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
  };

  return (
    <div className="todo-page-container">
      <NavBar />
      <div className="main-content-wrapper">
        <h1 className="todo-title">Gestión de Tareas</h1>

        <div className="project-info">
          <div className="info-item">
            <span className="project-info-label">Proyecto</span>
            <span className="project-info-value">📁 {projectName}</span>
          </div>
          {sectionName && (
            <div className="info-item">
              <span className="project-info-label">Sección</span>
              <span className="project-info-value">📂 {sectionName}</span>
            </div>
          )}
        </div>

        {!isCreatingNote && (
          <button 
            className="create-note-btn"
            onClick={() => setIsCreatingNote(true)}
          >
            ✨ Crear Nueva Nota
          </button>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {isCreatingNote && (
        <div className="note-card" style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Título de la nota..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="add-todo-btn" onClick={createNote}>
              Crear Nota
            </button>
            <button 
              className="add-todo-btn" 
              style={{ background: '#e53e3e' }}
              onClick={() => setIsCreatingNote(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 && !error && (
        <div className="no-notes-message">
          No hay notas disponibles en esta sección.
        </div>
      )}

      {notes.map(note => (
        <div key={note.id} className="note-card">
          <div className="note-header">
            {editingNoteId === note.id ? (
              <>
                <input
                  type="text"
                  className="note-title-input"
                  value={note.title}
                  onChange={(e) => {
                    const updatedTitle = e.target.value;
                    setNotes(prevNotes =>
                      prevNotes.map(n =>
                        n.id === note.id ? { ...n, title: updatedTitle } : n
                      )
                    );
                  }}
                  autoFocus
                />
                <div className="note-actions">
                  <button
                    className="save-note-btn"
                    onClick={() => {
                      saveNote(note.id, note.title);
                      setEditingNoteId(null);
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    className="cancel-edit-btn"
                    onClick={cancelEditingNote}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="note-info">
                  <h2 className="note-display-title">{note.title}</h2>
                  <div className="note-meta">
                    <span className="note-project">📁 {projectName}</span>
                    <span className="note-section">📂 {sectionName}</span>
                  </div>
                </div>
                <div className="note-actions">
                  <button
                    className="edit-note-btn"
                    onClick={() => startEditingNote(note.id)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="delete-note-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </>
            )}
          </div>

          <textarea
            className="todo-textarea"
            placeholder="Escribe el contenido del ToDo..."
            onBlur={(e) => addTodo(note.id, e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />

          {note.todos.length === 0 ? (
            <div className="no-todos-message">
              No hay ToDos en esta nota.
            </div>
          ) : (
            <ul className="todo-list">
              {note.todos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <input 
                    type="checkbox" 
                    checked={todo.is_completed}
                    onChange={() => toggleTodo(todo.id, todo.is_completed, todo.content)}
                    className="todo-checkbox"
                  />
                  <span className={`todo-content ${todo.is_completed ? 'completed' : ''}`}>
                    {todo.content}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="note-actions">
            <button 
              className="delete-note-btn"
              onClick={() => deleteNote(note.id)}
              style={{
                background: '#e53e3e',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                marginTop: '1rem'
              }}
            >
              Eliminar Nota
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToDoPage;