import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/ToDoPage.css';
import NavBar from '../components/NavBar';
import { useNotification } from '../hooks/useNotification';

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
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [newTodoContent, setNewTodoContent] = useState<{ [noteId: number]: string }>({});
  const [focusedNoteId, setFocusedNoteId] = useState<number | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoContent, setEditingTodoContent] = useState('');
  const { showSuccess, showError, showWarning } = useNotification();

  useEffect(() => {
    if (!sectionName) {
      showError('No se pudo obtener el nombre de la sección desde el estado');
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
        showError('Error al cargar las notas');
      }
    };

    fetchNotes();
  }, [sectionId, sectionName]);

  const createNote = async () => {
    if (!newNoteTitle.trim()) {
      showWarning('Por favor, ingresa un título para la nota');
      return;
    }
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showError('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente');
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
      showSuccess('Nota creada correctamente');
    } catch (err: any) {
      showError('Error al crear la nota');
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

      // Clear the input for this note
      setNewTodoContent(prev => ({ ...prev, [noteId]: '' }));
    } catch (err: any) {
      showError('Error al crear la tarea');
    }
  };

  const handleTodoKeyPress = (e: React.KeyboardEvent, noteId: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const content = newTodoContent[noteId] || '';
      if (content.trim()) {
        addTodo(noteId, content);
      }
    }
  };

  const handleTodoChange = (noteId: number, value: string) => {
    setNewTodoContent(prev => ({ ...prev, [noteId]: value }));
  };

  const deleteTodo = async (todoId: number, noteId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ToDo');
      }

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId 
            ? { ...note, todos: note.todos.filter(todo => todo.id !== todoId) }
            : note
        )
      );
      showSuccess('Tarea eliminada correctamente');
    } catch (err: any) {
      showError('Error al eliminar la tarea');
    }
  };

  const startEditingTodo = (todoId: number, content: string) => {
    setEditingTodoId(todoId);
    setEditingTodoContent(content);
  };

  const saveEditingTodo = async (todoId: number, isCompleted: boolean) => {
    if (!editingTodoContent.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: editingTodoContent, 
          is_completed: isCompleted 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el ToDo');
      }

      setNotes(prevNotes =>
        prevNotes.map(note => ({
          ...note,
          todos: note.todos.map(todo =>
            todo.id === todoId 
              ? { ...todo, content: editingTodoContent } 
              : todo
          )
        }))
      );

      setEditingTodoId(null);
      setEditingTodoContent('');
      showSuccess('Tarea actualizada correctamente');
    } catch (err: any) {
      showError('Error al actualizar la tarea');
    }
  };

  const cancelEditingTodo = () => {
    setEditingTodoId(null);
    setEditingTodoContent('');
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
      showError('Error al actualizar el estado de la tarea');
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
      showSuccess('Nota actualizada correctamente');
    } catch (err: any) {
      showError('Error al actualizar la nota');
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
      showSuccess('Nota eliminada correctamente');
    } catch (err: any) {
      showError('Error al eliminar la nota');
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
      </div>

      {isCreatingNote && (
        <div className="note-card note-card-creating">
          <input
            type="text"
            placeholder="Título de la nota..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="note-input-field"
            autoFocus
          />
          <div className="note-buttons-container">
            <button className="add-todo-btn" onClick={createNote}>
              Crear Nota
            </button>
            <button 
              className="add-todo-btn cancel-btn"
              onClick={() => setIsCreatingNote(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 && (
        <div className="no-notes-message">
          No hay notas disponibles en esta sección.
        </div>
      )}

      {notes.map(note => (
        <div key={note.id} className="note-card">
          <div className="note-header">
            {editingNoteId === note.id ? (
              <div className="note-edit-mode">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveNote(note.id, note.title);
                      setEditingNoteId(null);
                    } else if (e.key === 'Escape') {
                      cancelEditingNote();
                    }
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
                    💾 Guardar
                  </button>
                  <button
                    className="cancel-edit-btn"
                    onClick={cancelEditingNote}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="note-display-mode">
                <h2 className="note-display-title">{note.title}</h2>
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
              </div>
            )}
          </div>

          <div className="todo-input-section">
            <input
              type="text"
              className="todo-input"
              placeholder="Escribe un nuevo ToDo y presiona Enter..."
              value={newTodoContent[note.id] || ''}
              onChange={(e) => handleTodoChange(note.id, e.target.value)}
              onKeyDown={(e) => handleTodoKeyPress(e, note.id)}
              onFocus={() => setFocusedNoteId(note.id)}
              onBlur={() => setFocusedNoteId(null)}
            />
            <button
              className="add-todo-btn"
              onClick={() => {
                const content = newTodoContent[note.id] || '';
                if (content.trim()) {
                  addTodo(note.id, content);
                }
              }}
              disabled={!newTodoContent[note.id]?.trim()}
            >
              ➕ Agregar
            </button>
          </div>

          {note.todos.length === 0 ? (
            <div className="no-todos-message">
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <p>No hay tareas en esta nota</p>
                <span className="empty-hint">Escribe arriba para agregar tu primera tarea</span>
              </div>
            </div>
          ) : (
            <ul className="todo-list">
              {note.todos.map((todo, index) => (
                <li key={todo.id} className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
                  <div className="todo-number">{index + 1}</div>
                  <input 
                    type="checkbox" 
                    checked={todo.is_completed}
                    onChange={() => toggleTodo(todo.id, todo.is_completed, todo.content)}
                    className="todo-checkbox"
                  />
                  {editingTodoId === todo.id ? (
                    <div className="todo-edit-section">
                      <input
                        type="text"
                        className="todo-edit-input"
                        value={editingTodoContent}
                        onChange={(e) => setEditingTodoContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEditingTodo(todo.id, todo.is_completed);
                          } else if (e.key === 'Escape') {
                            cancelEditingTodo();
                          }
                        }}
                        autoFocus
                      />
                      <div className="todo-edit-actions">
                        <button
                          className="save-todo-btn"
                          onClick={() => saveEditingTodo(todo.id, todo.is_completed)}
                          title="Guardar cambios"
                        >
                          💾
                        </button>
                        <button
                          className="cancel-todo-btn"
                          onClick={cancelEditingTodo}
                          title="Cancelar edición"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="todo-content">
                        {todo.content}
                      </span>
                      <div className="todo-actions">
                        <button
                          className="edit-todo-btn"
                          onClick={() => startEditingTodo(todo.id, todo.content)}
                          title="Editar tarea"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-todo-btn"
                          onClick={() => deleteTodo(todo.id, note.id)}
                          title="Eliminar tarea"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToDoPage;