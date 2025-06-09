// src/components/AddTaskModal/AddTaskModal.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: A modal component for adding and editing tasks.
*/

import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import type { Task, TaskStatus } from '../../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './addTaskModal.scss';

interface AddTaskModalProps {
  onClose: () => void;
  taskToEdit?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!taskToEdit;

  useEffect(() => {
    // If a task is passed, populate the form for editing
    if (isEditMode) {
      setTitle(taskToEdit.title);
      setStatus(taskToEdit.status);
    }
  }, [isEditMode, taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        // Update the existing document
        const taskRef = doc(db, 'tasks', taskToEdit.id);
        await updateDoc(taskRef, {
          title: title.trim(),
          status: status
        });
      } else {
        // Add a new document
        await addDoc(collection(db, 'tasks'), {
          title: title.trim(),
          status: status,
          createdAt: serverTimestamp()
        });
      }
      onClose();
    } catch (err) {
      console.error("Error saving task: ", err);
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize the project proposal"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="To Do">To Do</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
