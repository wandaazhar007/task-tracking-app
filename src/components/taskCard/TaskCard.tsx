// src/components/taskCard/TaskCard.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: Represents a single draggable task card.
*/

import React from 'react';
import { useDrag } from 'react-dnd';
import type { Task } from '../../types/types';
import './taskCard.scss';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    // 'type' is a required key for react-dnd. It must match the 'accept' key in the drop target (our Column component).
    type: 'TASK_CARD',
    // 'item' is the data payload that gets passed when a drag operation begins.
    // We pass the task's id to identify which task is being moved.
    item: { id: task.id },
    // 'collect' monitors the drag state. 'isDragging' will be true while the card is being dragged.
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // The 'ref={drag}' attaches the drag-and-drop functionality to this div.
    // We reduce the opacity when the card is being dragged for a better visual effect.
    <div
      ref={drag}
      className="task-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <p className="task-title">{task.title}</p>
      {/* We can add more details here later, like subtasks or due dates */}
    </div>
  );
};

export default TaskCard;
