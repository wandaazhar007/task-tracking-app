// src/pages/dashboard/Dashboard.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: The main dashboard component that displays task columns and handles task management logic.
*/

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import type { Task, TaskStatus } from '../../types/types';

// Import the real components, not local placeholders
import Column from '../../components/column/Column';
import AddTaskModal from '../../components/addTaskModal/AddTaskModal';

// Import only the stylesheet for this component
import './dashboard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faList, faTh, faSearch, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statuses: TaskStatus[] = ['To Do', 'Doing', 'Done'];

  useEffect(() => {
    const tasksCollection = collection(db, 'tasks');
    const q = query(tasksCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const fetchedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task));
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks from Firestore: ", err);
        setError("Failed to load tasks. Check your connection or Firebase configuration.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDropTask = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      const taskRef = doc(db, 'tasks', taskId);
      try {
        await updateDoc(taskRef, { status: newStatus });
      } catch (err) {
        console.error("Error updating task status: ", err);
      }
    }
  };

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
          <button className="icon-btn"><FontAwesomeIcon icon={faEllipsisH} /></button>
          <button className="new-task-btn" onClick={() => setIsModalOpen(true)}>
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
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Dashboard;
