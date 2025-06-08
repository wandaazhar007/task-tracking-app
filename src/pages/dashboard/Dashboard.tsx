// src/pages/dashboard/Dashboard.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: The main dashboard component that displays task columns and handles task management logic.
*/

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Task, TaskStatus } from '../../types/types';

import './dashboard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faList, faTh, faSearch, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Placeholder for components to be created later
const Column = ({ title, tasks }: { title: string, tasks: Task[] }) => (
  <div className="column">
    <div className="column-header">
      <h3>{title}</h3>
      <span>{tasks.length}</span>
      <button className="add-task-btn-small"><FontAwesomeIcon icon={faPlus} /></button>
    </div>
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-card">{task.title}</div>
      ))}
      <button className="new-page-btn"><FontAwesomeIcon icon={faPlus} /> New page</button>
    </div>
  </div>
);


const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // Column statuses
  const statuses: TaskStatus[] = ['To Do', 'Doing', 'Done'];

  useEffect(() => {
    // Set up a real-time listener to fetch tasks from Firestore
    const tasksCollection = collection(db, 'tasks');
    // Order tasks by creation time
    const q = query(tasksCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        try {
          const fetchedTasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Task));
          setTasks(fetchedTasks);
          setLoading(false);
        } catch (err) {
          console.error("Error processing tasks snapshot: ", err);
          setError("Failed to process tasks. Please try refreshing the page.");
          setLoading(false);
        }
      },
      (err) => {
        // Handle listener errors
        console.error("Error fetching tasks from Firestore: ", err);
        setError("Failed to load tasks. Check your connection or Firebase configuration.");
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Filter tasks by status
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="title-section">
          <FontAwesomeIcon icon={faCheck} className="title-icon" />
          <h1>Wanda's Task List</h1>
        </div>
        <p>We use this tool to track your tasks. <br />
          you are not allowed to create a new task directly on this board by your self <br />
          Click an existing task to add additional context or subtasks or some issue
        </p>
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
          <button className="icon-btn"><FontAwesomeIcon icon={faEllipsisH} /></button>
          <button className="new-task-btn" /* onClick={() => setIsModalOpen(true)} */>
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
                title={status}
                tasks={getTasksByStatus(status)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Placeholder for the AddTaskModal 
      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
      */}
    </div>
  );
}

export default Dashboard;
