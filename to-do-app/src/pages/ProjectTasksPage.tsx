import { useParams } from 'react-router-dom';
import { useState } from 'react';
import NavBar from '../components/NavBar';
import '../styles/ProjectTasksPage.css';

// Tipo para las tareas
type Task = {
  id: number;
  title: string;
  text: string;
  completed: boolean;
};

const ProjectTasksPage = () => {
  // Usamos projectName en lugar de projectId
  const { projectName } = useParams<{ projectName: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  
  // Decodificar el nombre del proyecto
  const decodedProjectName = projectName ? decodeURIComponent(projectName) : '';
  
  const addTask = () => {
    if (newTaskTitle.trim() === '' || newTaskText.trim() === '') {
      alert('El título y el texto de la tarea no pueden estar vacíos.');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle, 
      text: newTaskText,
      completed: false
    };

    setTasks([...tasks, newTask]); 
    setNewTaskTitle(''); 
    setNewTaskText(''); 
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div>
      <NavBar />
      
      <div className="project-tasks-container">
        <div className="project-header">
          <h1>{decodedProjectName}</h1>
          <p>Gestiona las tareas de este proyecto</p>
        </div>

        <div className="task-input-container">
          <input
            type="text"
            placeholder="Título de la tarea..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Descripción de la tarea..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          ></textarea>
          <button onClick={addTask}>Añadir</button>
        </div>

        <div className="tasks-list">
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className={task.completed ? 'completed' : ''}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                    />
                    <div>
                      <strong>{task.title}</strong> 
                      <p>{task.text}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-tasks">
              No hay tareas en este proyecto. ¡Añade tu primera tarea!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTasksPage;