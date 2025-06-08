// src/components/column/Column.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single column (e.g., 'To Do', 'Doing', 'Done') in the task board.
*/

import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Task, TaskStatus } from '../../types/types';
import TaskCard from '../taskCard/TaskCard'; // Using the actual TaskCard component
import './column.scss';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  // We will implement this function later to handle the drag-and-drop logic
  // onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK_CARD',
    // drop: (item: { id: string }) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // This is the key change: We create our own ref using React.useRef.
  const ref = React.useRef<HTMLDivElement>(null);
  // Then, we connect the react-dnd 'drop' functionality to our ref.
  drop(ref);

  const statusClass = status.replace(/\s+/g, '-');

  return (
    // We now pass our own, correctly-typed ref to the div.
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