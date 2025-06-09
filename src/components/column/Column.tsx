// src/components/column/Column.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single column that passes edit and delete handlers to its TaskCards.
*/

import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Task, TaskStatus } from '../../types/types';
import TaskCard from '../taskCard/TaskCard';
import './column.scss';

// The interface is now updated to accept the edit and delete handlers.
interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onDropTask, onEditTask, onDeleteTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK_CARD',
    drop: (item: { id: string }) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, onDropTask]);

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
        {/* The handlers are now passed down to each TaskCard */}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
      <button className="new-page-btn">
        <FontAwesomeIcon icon={faPlus} /> New page
      </button>
    </div>
  );
};

export default Column;