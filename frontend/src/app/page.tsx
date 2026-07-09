'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:8080/api/tasks';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, completed: false }),
      });
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    
    // Optimistically update the UI
    setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));

    try {
      // In Spring Boot, saving an entity with an existing ID will update it
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert if it failed
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Spring Boot + Next.js Synergy</p>
      </header>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button 
          type="submit" 
          className="add-btn"
          disabled={!newTaskTitle.trim()}
        >
          Add Task
        </button>
      </form>

      <div className="task-list">
        {isLoading ? (
          <div className="empty-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks yet. Add one above!</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task)}
                />
                <span className="task-title">{task.title}</span>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
