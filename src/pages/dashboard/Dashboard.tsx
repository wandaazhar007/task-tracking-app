// src/pages/dashboard/Dashboard.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: The main dashboard, with a working theme toggle button.
*/

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import type { Task, TaskStatus } from '../../types/types';

// Step 1: Import the useTheme hook and the necessary icons
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faList, faTh, faSearch, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import Column from '../../components/column/Column';
import AddTaskModal from '../../components/addTaskModal/AddTaskModal';
import './dashboard.scss';


const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Step 2: Get the theme and toggle function from the context
  const { theme, toggleTheme } = useTheme();

  const statuses: TaskStatus[] = ['To Do', 'Doing', 'Done'];

  useEffect(() => {
    const tasksCollection = collection(db, 'tasks');
    const q = query(tasksCollection, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(fetchedTasks);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching tasks: ", err);
      setError("Failed to load tasks.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const handleDropTask = async (taskId: string, newStatus: TaskStatus) => {
    await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
  };

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(task => task.status === status);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="title-section">
          <FontAwesomeIcon icon={faCheck} className="title-icon" />
          <h1>Wanda's Task List</h1>
        </div>
        <p>A project by Wanda Azhar. Use this tool to track your tasks efficiently.</p>
      </div>

      <div className="toolbar">
        <div className="view-options">
          <button className="view-btn active">
            <FontAwesomeIcon icon={faTh} /> Board View
          </button>
        </div>
        <div className="action-buttons">
          <button className="icon-btn"><FontAwesomeIcon icon={faList} /></button>
          <button className="icon-btn"><i className="fa-solid fa-bolt"></i></button>
          <button className="icon-btn"><FontAwesomeIcon icon={faSearch} /></button>
          {/* Step 3: This is the theme toggle button. It will now show up. */}
          <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
          <button className="new-task-btn" onClick={() => handleOpenModal()}>
            New <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      <div className="board-content">
        {loading && <p>Loading tasks...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="columns-container">
            {statuses.map(status => (
              <Column
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onDropTask={handleDropTask}
                onEditTask={handleOpenModal}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <AddTaskModal onClose={handleCloseModal} taskToEdit={editingTask} />}
    </div>
  );
}

export default Dashboard;
