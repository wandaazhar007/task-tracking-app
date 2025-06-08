// src/components/column/Column.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single column that accepts dropped task cards.
*/

import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Task, TaskStatus } from '../../types/types';
import TaskCard from '../taskCard/TaskCard';
import './column.scss';

// The props interface is updated to accept the onDropTask function.
interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onDropTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK_CARD',
    // The 'drop' function is now active. It calls onDropTask when a card is dropped.
    drop: (item: { id: string }) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, onDropTask]); // Dependencies for the useDrop hook

  const ref = React.useRef<HTMLDivElement>(null);
  drop(ref);

  const statusClass = status.replace(/\s+/g, '-');

  return (
    <div ref={ref} className={`column ${isOver ? 'is-over' : ''}`}>
      <div className="column-header">
        <h3 className={statusClass}>{status}</h3>
        <span className="task-count">{tasks.length}</span>
        <button className="add-task-btn-small" aria-label={`Add new task to ${status}`}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <button className="new-page-btn">
        <FontAwesomeIcon icon={faPlus} /> New page
      </button>
    </div>
  );
};

export default Column;
