/*
Author: Wanda Azhar
Location: Twin Falls, ID. USA
Contact: wandaazhar@gmail.com
Description: TypeScript type definitions for the Task Tracking App.
*/

// Defines the possible statuses for a task.
export type TaskStatus = 'To Do' | 'Doing' | 'Done';

// Represents a single task item.
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number; // Timestamp of when the task was created
}
