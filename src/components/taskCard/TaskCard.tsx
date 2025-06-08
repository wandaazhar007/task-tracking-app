// src/components/taskCard/TaskCard.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single draggable task card.
*/

import React from 'react';
// We import ConnectDragSource and ConnectDragPreview for explicit typing.
import { useDrag, type ConnectDragSource, type ConnectDragPreview } from 'react-dnd';
import type { Task } from '../../types/types';
import './taskCard.scss';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // The useDrag hook returns a tuple with collected props, a drag ref, and a preview ref.
  // We must destructure all three, even if we don't use the preview.
  const [{ isDragging }, drag, preview]: [
    { isDragging: boolean },
    ConnectDragSource,
    ConnectDragPreview
  ] = useDrag(() => ({
    type: 'TASK_CARD',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Attach the drag and preview refs to the same element.
  const ref = React.useRef<HTMLDivElement>(null);
  drag(ref);
  preview(ref);

  return (
    // The ref now correctly connects react-dnd to this div.
    <div
      ref={ref}
      className="task-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <p className="task-title">{task.title}</p>
    </div>
  );
};

export default TaskCard;
