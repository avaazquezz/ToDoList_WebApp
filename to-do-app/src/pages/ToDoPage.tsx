import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// Sortable Note Component
interface SortableNoteProps {
  note: Note;
  editingNoteId: number | null;
  setEditingNoteId: (id: number | null) => void;
  newTodoContent: { [noteId: number]: string };
  focusedNoteId: number | null;
  setFocusedNoteId: (id: number | null) => void;
  editingTodoId: number | null;
  editingTodoContent: string;
  setEditingTodoContent: (content: string) => void;
  onSaveNote: (noteId: number, title: string) => void;
  onDeleteNote: (noteId: number) => void;
  onAddTodo: (noteId: number, content: string) => void;
  onToggleTodo: (todoId: number, isCompleted: boolean, content: string) => void;
  onDeleteTodo: (todoId: number, noteId: number) => void;
  onStartEditingTodo: (todoId: number, content: string) => void;
  onSaveEditingTodo: (todoId: number, isCompleted: boolean) => void;
  onCancelEditingTodo: () => void;
  onCancelEditingNote: () => void;
  onHandleTodoKeyPress: (e: React.KeyboardEvent, noteId: number) => void;
  onHandleTodoChange: (noteId: number, value: string) => void;
  onSetNotes: (notes: Note[]) => void;
  notes: Note[];
}

const SortableNote: React.FC<SortableNoteProps> = ({
  note,
  editingNoteId,
  setEditingNoteId,
  newTodoContent,
  focusedNoteId,
  setFocusedNoteId,
  editingTodoId,
  editingTodoContent,
  setEditingTodoContent,
  onSaveNote,
  onDeleteNote,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onStartEditingTodo,
  onSaveEditingTodo,
  onCancelEditingTodo,
  onCancelEditingNote,
  onHandleTodoKeyPress,
  onHandleTodoChange,
  onSetNotes,
  notes,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: note.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`note-card ${isDragging ? 'dragging' : ''}`}
    >
      {/* Drag Handle */}
      <div className="note-drag-handle" {...attributes} {...listeners}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 19V17H9V19H7ZM11 19V17H13V19H11ZM15 19V17H17V19H15ZM7 15V13H9V15H7ZM11 15V13H13V15H11ZM15 15V13H17V15H15ZM7 11V9H9V11H7ZM11 11V9H13V11H11ZM15 11V9H17V11H15ZM7 7V5H9V7H7ZM11 7V5H13V7H11ZM15 7V5H17V7H15Z"/>
        </svg>
      </div>

      <div className="note-header">
        {editingNoteId === note.id ? (
          <div className="note-edit-mode">
            <input
              type="text"
              className="note-title-input"
              value={note.title}
              onChange={(e) => {
                const updatedTitle = e.target.value;
                onSetNotes(
                  notes.map(n =>
                    n.id === note.id ? { ...n, title: updatedTitle } : n
                  )
                );
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSaveNote(note.id, note.title);
                  setEditingNoteId(null);
                } else if (e.key === 'Escape') {
                  onCancelEditingNote();
                }
              }}
              autoFocus
            />
            <div className="note-actions">
              <button
                className="save-note-btn"
                onClick={() => {
                  onSaveNote(note.id, note.title);
                  setEditingNoteId(null);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Guardar
              </button>
              <button
                className="cancel-note-btn"
                onClick={onCancelEditingNote}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="note-display-mode">
            <h3 className="note-title">{note.title}</h3>
            <div className="note-actions">
              <button
                className="edit-note-btn"
                onClick={() => setEditingNoteId(note.id)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Editar
              </button>
              <button
                className="delete-note-btn"
                onClick={() => onDeleteNote(note.id)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Todo Section */}
      <div className={`add-todo-section ${focusedNoteId === note.id ? 'focused' : ''}`}>
        <input
          type="text"
          className="todo-input"
          placeholder="Escribe una nueva tarea y presiona Enter..."
          value={newTodoContent[note.id] || ''}
          onChange={(e) => onHandleTodoChange(note.id, e.target.value)}
          onKeyDown={(e) => onHandleTodoKeyPress(e, note.id)}
          onFocus={() => setFocusedNoteId(note.id)}
          onBlur={() => setFocusedNoteId(null)}
        />
        <button
          className="add-todo-btn"
          onClick={() => {
            const content = newTodoContent[note.id] || '';
            if (content.trim()) {
              onAddTodo(note.id, content);
            }
          }}
          disabled={!newTodoContent[note.id]?.trim()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4V10H20C21.1 10 22 10.9 22 12S21.1 14 20 14H14V20C14 21.1 13.1 22 12 22S10 21.1 10 20V14H4C2.9 14 2 13.1 2 12S2.9 10 4 10H10V4C10 2.9 10.9 2 12 2Z"/>
          </svg>
          Agregar
        </button>
      </div>

      {/* Professional Todo List */}
      {note.todos.length === 0 ? (
        <div className="no-todos-message">
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>No hay tareas en esta nota</p>
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
                onChange={() => onToggleTodo(todo.id, todo.is_completed, todo.content)}
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
                        onSaveEditingTodo(todo.id, todo.is_completed);
                      } else if (e.key === 'Escape') {
                        onCancelEditingTodo();
                      }
                    }}
                    autoFocus
                  />
                  <div className="todo-edit-actions">
                    <button 
                      className="save-todo-btn"
                      onClick={() => onSaveEditingTodo(todo.id, todo.is_completed)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </button>
                    <button 
                      className="cancel-todo-btn"
                      onClick={onCancelEditingTodo}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span 
                    className="todo-content"
                    onClick={() => onStartEditingTodo(todo.id, todo.content)}
                  >
                    {todo.content}
                  </span>
                  <button 
                    className="delete-todo-btn"
                    onClick={() => onDeleteTodo(todo.id, note.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ToDoPage: React.FC = () => {
  const { projectName, sectionId } = useParams<{ projectName: string; sectionId: string }>();
  const location = useLocation();
  const sectionName = location.state?.sectionName || ''; // Use section name from state

  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [newTodoContent, setNewTodoContent] = useState<{ [noteId: number]: string }>({});
  const [focusedNoteId, setFocusedNoteId] = useState<number | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoContent, setEditingTodoContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

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

      // Clear the input for this note
      setNewTodoContent(prev => ({ ...prev, [noteId]: '' }));
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
    setNoteToDelete(noteId);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la nota');
      }

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (err: any) {
      setError(err.message);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
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
        {/* Professional Header Section */}
        <div className="todo-header-section">
          <h1 className="todo-title">Gestión de Tareas</h1>
          <p className="todo-subtitle">Organiza y gestiona tus ideas de manera profesional</p>
        </div>

        {/* Ultra Professional Project Breadcrumb */}
        <div className="project-info">
          <div className="project-breadcrumb">
            <div className="breadcrumb-item">
              <div className="breadcrumb-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div className="breadcrumb-content">
                <span className="breadcrumb-label">Proyecto</span>
                <span className="breadcrumb-value">{projectName}</span>
              </div>
            </div>
            
            {sectionName && (
              <>
                <span className="breadcrumb-separator">›</span>
                <div className="breadcrumb-item">
                  <div className="breadcrumb-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                    </svg>
                  </div>
                  <div className="breadcrumb-content">
                    <span className="breadcrumb-label">Sección</span>
                    <span className="breadcrumb-value">{sectionName}</span>
                  </div>
                </div>
              </>
            )}
            
            <span className="breadcrumb-separator">›</span>
            <div className="breadcrumb-item">
              <div className="breadcrumb-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v2H8V2c0-.55-.45-1-1-1s-1 .45-1 1v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
              <div className="breadcrumb-content">
                <span className="breadcrumb-label">Notas</span>
                <span className="breadcrumb-value">
                  {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
                </span>
              </div>
            </div>
            
            {notes.length > 0 && (
              <>
                <span className="breadcrumb-separator">›</span>
                <div className="breadcrumb-item">
                  <div className="breadcrumb-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <div className="breadcrumb-content">
                    <span className="breadcrumb-label">Tareas</span>
                    <span className="breadcrumb-value">
                      {notes.reduce((total, note) => total + note.todos.length, 0)} total
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ultra Professional Create Note Button */}
        {!isCreatingNote && (
          <div className="create-note-section">
            <button 
              className="create-note-btn"
              onClick={() => setIsCreatingNote(true)}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span className="btn-text">Crear Nueva Nota</span>
            </button>
          </div>
        )}

        {/* Professional Error Message */}
        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Ultra Professional Create Note Form */}
      {isCreatingNote && (
        <div className="note-card note-card-creating">
          <div className="note-header">
            <h3 style={{ 
              margin: 0, 
              color: 'var(--text-primary)', 
              fontSize: '1.5rem', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🌟</span>
              Crear Nueva Nota
            </h3>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem',
              fontStyle: 'italic'
            }}>
              Organiza tus ideas de manera profesional
            </p>
          </div>
          <input
            type="text"
            placeholder="🎯 Ingresa el título de tu nota..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newNoteTitle.trim()) {
                createNote();
              } else if (e.key === 'Escape') {
                setIsCreatingNote(false);
                setNewNoteTitle('');
              }
            }}
            className="note-input-field"
            autoFocus
          />
          <div className="note-buttons-container">
            <button 
              className="add-todo-btn" 
              onClick={createNote}
              disabled={!newNoteTitle.trim()}
              style={{
                background: newNoteTitle.trim() 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'var(--bg-tertiary)',
                transform: newNoteTitle.trim() ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.3s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {newNoteTitle.trim() ? 'Crear Nota' : 'Escribe un título'}
            </button>
            <button 
              className="cancel-btn" 
              onClick={() => {
                setIsCreatingNote(false);
                setNewNoteTitle('');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Professional No Notes Message */}
      {notes.length === 0 && !error && !isCreatingNote && (
        <div className="no-notes-message">
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
              No hay notas disponibles
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Comienza creando tu primera nota para organizar tus tareas
            </p>
          </div>
        </div>
      )}

      {/* Professional Notes List */}
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Guardar
                  </button>
                  <button
                    className="cancel-edit-btn"
                    onClick={cancelEditingNote}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Cancelar
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Editar
                  </button>
                  <button
                    className="delete-note-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Professional Todo Input */}
          <div className="todo-input-section">
            <input
              type="text"
              className="todo-input"
              placeholder="Escribe una nueva tarea y presiona Enter..."
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4V10H20C21.1 10 22 10.9 22 12S21.1 14 20 14H14V20C14 21.1 13.1 22 12 22S10 21.1 10 20V14H4C2.9 14 2 13.1 2 12S2.9 10 4 10H10V4C10 2.9 10.9 2 12 2Z"/>
              </svg>
              Agregar
            </button>
          </div>

          {/* Professional Todo List */}
          {note.todos.length === 0 ? (
            <div className="no-todos-message">
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>No hay tareas en esta nota</p>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </button>
                        <button
                          className="cancel-todo-btn"
                          onClick={cancelEditingTodo}
                          title="Cancelar edición"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button
                          className="delete-todo-btn"
                          onClick={() => deleteTodo(todo.id, note.id)}
                          title="Eliminar tarea"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
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

      {/* Modal de confirmación para eliminar nota */}
      {showDeleteModal && (
        <div className="modal-overlay confirm-modal" onClick={cancelDeleteNote}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-content">
              <div className="confirm-modal-icon-container">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="warning-icon">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="confirm-modal-warning-box">
                <div className="confirm-modal-warning-badge">⚠️ ATENCIÓN</div>
                <p className="confirm-modal-text">
                  ¿Estás seguro de que deseas eliminar esta nota?
                  
                  Esta acción no se puede deshacer y se eliminarán todas las tareas asociadas.
                </p>
              </div>
              <div className="modal-actions confirm-modal-actions">
                <button
                  type="button"
                  className="modal-btn confirm-cancel-button"
                  onClick={cancelDeleteNote}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-btn confirm-delete-button"
                  onClick={confirmDeleteNote}
                >
                  Eliminar Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoPage;