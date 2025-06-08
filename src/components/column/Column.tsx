// src/components/column/Column.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single column (e.g., 'To Do', 'Doing', 'Done') in the task board.
*/

import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Task, TaskStatus } from '../../types/types';
import './column.scss';

// Placeholder for the TaskCard component
const TaskCard = ({ task }: { task: Task }) => (
  <div className="task-card-placeholder">
    {task.title}
  </div>
);


interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  // We'll add functions for moving/adding tasks later
  // onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK_CARD', // This needs to match the 'type' in the TaskCard's useDrag hook
    // drop: (item: { id: string }) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Dynamically create a class name for status-specific styling
  const statusClass = status.replace(/\s+/g, '-');

  return (
    <div ref={drop} className={`column ${isOver ? 'is-over' : ''}`}>
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

