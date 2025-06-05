
import React, { useState, useEffect, } from 'react';
import type { FormEvent } from 'react';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { setLogLevel } from 'firebase/app';

// --- Firebase Configuration ---
// These global variables are expected to be provided by the Canvas environment.
declare global {
  var __app_id: string | undefined;
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id-task-tracker';
const firebaseConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
let firebaseConfig = {};
try {
  firebaseConfig = JSON.parse(firebaseConfigStr);
  if (Object.keys(firebaseConfig).length === 0) {
    console.warn("Firebase config is empty. Using placeholder for local development.");
    // Add your local Firebase config here for testing if __firebase_config is not provided
    firebaseConfig = {
      apiKey: "AIzaSyD-jkusQP8Z27zYp-bxE-76XaBNlY9M0WY",
      authDomain: "task-tracking-app-9ec40.firebaseapp.com",
      projectId: "task-tracking-app-9ec40",
      storageBucket: "task-tracking-app-9ec40.firebasestorage.app",
      messagingSenderId: "659120951358",
      appId: "1:659120951358:web:8d9b391cefc3f2d89c016f",
      measurementId: "G-LVSTPCC2FK"
    };
  }
} catch (e) {
  console.error("Error parsing Firebase config:", e);
}

// --- TypeScript Interfaces ---
interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: Timestamp | Date; // Store as Timestamp, allow Date for new tasks
  icon?: string; // Optional: for icons like 'fa-desktop'
}

type TaskStatus = 'todo' | 'doing' | 'done';

const COLUMN_TITLES: Record<TaskStatus, string> = {
  todo: 'To Do',
  doing: 'Doing',
  done: 'Done',
};

const COLUMN_ICONS: Record<TaskStatus, { icon: string; color: string }> = {
  todo: { icon: 'fas fa-circle', color: '#E74C3C' }, // Red
  doing: { icon: 'fas fa-circle', color: '#F39C12' }, // Yellow/Orange
  done: { icon: 'fas fa-check-circle', color: '#2ECC71' }, // Green
};




// Task Card Component
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-card" onClick={() => onEdit(task)}>
      <span className="task-title">{task.title}</span>
      {task.icon && <i className={`task-icon ${task.icon}`}></i>}
      {/* Placeholder for more actions if needed, not shown in image but good for future */}
      {/* <div className="task-actions">
        <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}><i className="fas fa-trash-alt"></i></button>
      </div> */}
    </div>
  );
};






// Column Component
interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}
const Column: React.FC<ColumnProps> = ({ status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const columnSpecificTasks = tasks.filter(task => task.status === status);
  const columnMeta = COLUMN_ICONS[status];

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title-group">
          <i className={columnMeta.icon} style={{ color: columnMeta.color }}></i>
          <h2>{COLUMN_TITLES[status]}</h2>
          <span className="column-count">{columnSpecificTasks.length}</span>
          {/* Static 100% from image - could be dynamic task count / total */}
        </div>
        <button className="add-task-to-column-btn" onClick={() => onAddTask(status)} title={`Add task to ${COLUMN_TITLES[status]}`}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="task-list">
        {columnSpecificTasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
      <div className="add-new-page-btn-container">
        <button className="add-new-page-btn" onClick={() => onAddTask(status)}>
          <i className="fas fa-plus"></i> New page
        </button>
      </div>
    </div>
  );
};




// Task Modal Component
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'>, id?: string) => void;
  taskToEdit?: Task | null;
  defaultStatus?: TaskStatus;
}
const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, defaultStatus }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus || 'todo');
  const [icon, setIcon] = useState('');


  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setStatus(taskToEdit.status);
      setIcon(taskToEdit.icon || '');
    } else {
      setTitle('');
      setStatus(defaultStatus || 'todo');
      setIcon('');
    }
  }, [taskToEdit, isOpen, defaultStatus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, status, icon: icon || undefined }, taskToEdit?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
            <option value="todo">{COLUMN_TITLES.todo}</option>
            <option value="doing">{COLUMN_TITLES.doing}</option>
            <option value="done">{COLUMN_TITLES.done}</option>
          </select>
          <input
            type="text"
            placeholder="Font Awesome icon (e.g., fa-solid fa-desktop)"
            value={icon}
            onChange={e => setIcon(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};











const Dashboard: React.FC = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState<TaskStatus>('todo');

  const [activeTab, setActiveTab] = useState<'board' | 'timeline' | 'board+'>('board');

  const [fbApp, setFbApp] = useState<FirebaseApp | null>(null);
  const [fbAuth, setFbAuth] = useState<Auth | null>(null);
  const [fbDb, setFbDb] = useState<Firestore | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);


  // Initialize Firebase
  useEffect(() => {
    try {
      if (Object.keys(firebaseConfig).length > 0 && (firebaseConfig as any).projectId) {
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        setFbApp(app);
        const auth = getAuth(app);
        setFbAuth(auth);
        const db = getFirestore(app);
        setFbDb(db);
        setLogLevel('debug'); // Firebase debug logging
        console.log("Firebase initialized successfully.");

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUser(user);
            setUserId(user.uid);
            console.log("User is signed in:", user.uid);
          } else {
            setCurrentUser(null);
            // Attempt to sign in if no user
            const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (token && token.trim() !== "") {
              try {
                await signInWithCustomToken(auth, token);
                console.log("Signed in with custom token.");
              } catch (e) {
                console.error("Custom token sign-in failed, trying anonymous:", e);
                await signInAnonymously(auth);
                console.log("Signed in anonymously after custom token failure.");
              }
            } else {
              await signInAnonymously(auth);
              console.log("Signed in anonymously.");
            }
          }
          setIsAuthReady(true);
        });
        return () => unsubscribe();

      } else {
        setError("Firebase configuration is missing or invalid.");
        setIsLoading(false);
        setIsAuthReady(true); // Still set auth ready to allow UI to render with error
      }
    } catch (e: any) {
      console.error("Firebase initialization error:", e);
      setError(`Firebase init error: ${e.message}`);
      setIsLoading(false);
      setIsAuthReady(true);
    }
  }, []);

  // Fetch tasks from Firebase
  useEffect(() => {
    if (!isAuthReady || !fbDb || !userId) {
      if (isAuthReady && !userId) console.log("Auth is ready, but no user ID yet. Waiting for user ID to fetch tasks.");
      // Don't fetch if db or userId is not available, or auth not ready
      return;
    }

    setIsLoading(true);
    const tasksCollectionPath = `artifacts/${appId}/users/${userId}/tasks`;
    console.log(`Fetching tasks from: ${tasksCollectionPath}`);
    const q = query(collection(fbDb, tasksCollectionPath)); // Add orderBy here if needed, e.g., orderBy("createdAt", "asc")

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date() // Ensure createdAt is a Date
        } as Task));
        setTasks(tasksData);
        setIsLoading(false);
        setError(null);
        console.log("Tasks fetched/updated: ", tasksData.length);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError(`Failed to fetch tasks: ${err.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, fbDb, userId]); // Depend on auth readiness and db instance and userId

  const handleOpenModal = (status?: TaskStatus, task?: Task) => {
    setDefaultModalStatus(status || 'todo');
    setTaskToEdit(task || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>, id?: string) => {
    if (!fbDb || !userId) {
      setError("Database not available or user not authenticated.");
      return;
    }
    const tasksCollectionPath = `artifacts/${appId}/users/${userId}/tasks`;

    try {
      if (id) { // Editing existing task
        const taskDocRef = doc(fbDb, tasksCollectionPath, id);
        await updateDoc(taskDocRef, { ...taskData, updatedAt: serverTimestamp() });
        console.log("Task updated:", id);
      } else { // Adding new task
        await addDoc(collection(fbDb, tasksCollectionPath), {
          ...taskData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log("Task added");
      }
    } catch (e: any) {
      console.error("Error saving task:", e);
      setError(`Failed to save task: ${e.message}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!fbDb || !userId) {
      setError("Database not available or user not authenticated.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) { // Replace with custom modal later
      const taskDocRef = doc(fbDb, `artifacts/${appId}/users/${userId}/tasks`, taskId);
      try {
        await deleteDoc(taskDocRef);
        console.log("Task deleted:", taskId);
      } catch (e: any) {
        console.error("Error deleting task:", e);
        setError(`Failed to delete task: ${e.message}`);
      }
    }
  };

  // Initial tasks based on image (for testing if Firebase is slow or empty)
  // This is for local display only if Firebase doesn't load.
  // In a real app, this would be seeded in Firebase or not present.
  useEffect(() => {
    if (!isLoading && tasks.length === 0 && !error && fbDb && userId) { // Only if loading is done, no tasks, no error
      const initialTasks: Omit<Task, 'id' | 'createdAt'>[] = [
        { title: 'Implement UI Login Page', status: 'todo' },
        { title: 'API Login (JWT)', status: 'todo' },
        { title: 'API Register', status: 'todo' },
        { title: 'Rebuild Web CFE with Next.Js', status: 'todo' },
        { title: 'Redesign Web BMG Media', status: 'todo' },
        { title: 'Migration Server App POS BMI', status: 'doing', icon: 'fas fa-desktop' },
        { title: 'Implement Register Page', status: 'doing' },
        { title: 'Migration Server BMI', status: 'done' },
        { title: 'Migration Server Web CFE', status: 'done' },
        { title: 'Finalize Web CFE with NextJs', status: 'done' },
      ];
      // Check if we should add initial tasks (e.g., only once per user or if collection is empty)
      // For simplicity, this example doesn't automatically add them to Firebase,
      // but you could add a button or logic to do so.
      // setTasks(initialTasks.map((t, i) => ({...t, id: `initial-${i}`, createdAt: new Date() })));
      console.log("No tasks found in Firebase for this user. Displaying placeholder info or empty board.");
    }
  }, [isLoading, tasks, error, fbDb, userId]);

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <div className="header-top">
            <i className="fas fa-clipboard-check header-title-icon"></i>
            <h1>Wanda's Task List</h1>
          </div>
          <p className="header-subtitle">
            We use this tool to track your tasks. You are not allowed to create a new task directly on this board by yourself. Click an existing task to add additional context or subtasks or some issue.
          </p>
          <nav className="header-nav">
            <div className="nav-tabs">
              <button className={activeTab === 'board' ? 'active' : ''} onClick={() => setActiveTab('board')}>
                <i className="fas fa-table-columns"></i> Board View
              </button>
              <button className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>
                <i className="fas fa-chart-gantt"></i> Timeline
              </button>
              <button className={activeTab === 'board+' ? 'active' : ''} onClick={() => setActiveTab('board+')}>
                <i className="fas fa-plus-square"></i> Board +
              </button>
            </div>
            <div className="nav-actions">
              <button className="action-icon-btn" title="Filter"><i className="fas fa-filter"></i></button>
              <button className="action-icon-btn" title="Sort"><i className="fas fa-sort"></i></button>
              <button className="action-icon-btn" title="Search"><i className="fas fa-search"></i></button>
              <button className="new-task-btn" onClick={() => handleOpenModal('todo')}>
                <i className="fas fa-plus"></i> New
              </button>
            </div>
          </nav>
        </header>

        {userId && <div className="user-id-display">User ID: {userId}</div>}

        {activeTab === 'board' && (
          <>
            {isLoading && <div className="loading-message">Loading tasks...</div>}
            {error && <div className="error-message">Error: {error}</div>}
            {!isLoading && !error && (
              <main className="board">
                {(['todo', 'doing', 'done'] as TaskStatus[]).map(status => (
                  <Column
                    key={status}
                    status={status}
                    tasks={tasks}
                    onAddTask={(stat) => handleOpenModal(stat)}
                    onEditTask={(task) => handleOpenModal(task.status, task)}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </main>
            )}
            {!isLoading && !error && tasks.length === 0 && !userId && (
              <div className="loading-message">Please wait, authenticating user... If this persists, check Firebase setup.</div>
            )}
            {!isLoading && !error && tasks.length === 0 && userId && (
              <div className="loading-message">No tasks found. Add a new task to get started!</div>
            )}
          </>
        )}
        {activeTab === 'timeline' && <div className="loading-message">Timeline view is not yet implemented.</div>}
        {activeTab === 'board+' && <div className="loading-message">Board+ feature is not yet implemented.</div>}


        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          defaultStatus={defaultModalStatus}
        />
      </div>
    </>
  );
}

export default Dashboard;