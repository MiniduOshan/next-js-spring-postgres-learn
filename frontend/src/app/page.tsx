'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
}

const API_URL = 'http://localhost:8080/api/tasks';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState('LOW');
  const [isLoading, setIsLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

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
        body: JSON.stringify({ title: newTaskTitle, completed: false, priority: newPriority }),
      });
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setNewTaskTitle('');
      setNewPriority('LOW');
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
    setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (task: Task) => {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }

    const updatedTask = { ...task, title: editingTitle };
    setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    setEditingId(null);

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error('Error saving edited task:', error);
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
        <select 
          className="priority-select" 
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button 
          type="submit" 
          className="add-btn"
          disabled={!newTaskTitle.trim()}
        >
          Add
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
                
                {editingId === task.id ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="task-title">{task.title}</span>
                    <span className={`badge ${task.priority}`}>{task.priority}</span>
                  </>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {editingId === task.id ? (
                  <button className="action-btn" onClick={() => saveEdit(task)} aria-label="Save">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                ) : (
                  <button className="action-btn" onClick={() => startEditing(task)} aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                )}
                
                <button className="action-btn" onClick={() => handleDeleteTask(task.id)} aria-label="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
