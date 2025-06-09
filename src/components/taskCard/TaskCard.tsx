// src/components/taskCard/TaskCard.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single draggable task card with edit and delete functionality.
*/

import React from 'react';
import { useDrag } from 'react-dnd';
import type { Task } from '../../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './taskCard.scss';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK_CARD',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  // This is the key change: We create a standard React ref.
  const ref = React.useRef<HTMLDivElement>(null);
  // Then we connect react-dnd's drag functionality to our own ref.
  drag(ref);

  return (
    // We then pass our correctly typed ref to the div.
    <div
      ref={ref}
      className="task-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onEdit(task)}
    >
      <p className="task-title">{task.title}</p>
      <button className="delete-btn" onClick={handleDelete} aria-label={`Delete task ${task.title}`}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default TaskCard;