import React from 'react';
import type { Task } from '../types';
import { Priority } from '../types';

interface TaskCardProps {
  task: Task;
}

const priorityColorMap: Record<Priority, string> = {
  [Priority.High]: 'border-l-4 border-red-500',
  [Priority.Medium]: 'border-l-4 border-yellow-500',
  [Priority.Low]: 'border-l-4 border-blue-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceStatus', task.status);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-gray-800 rounded-md p-4 shadow-lg cursor-grab active:cursor-grabbing hover:bg-gray-700 transition-all duration-200 ${priorityColorMap[task.priority]}`}>
      <h4 className="font-bold text-gray-100">{task.title}</h4>
      <p className="text-sm text-gray-400 mt-2 truncate">{task.description}</p>
      <div className="mt-4 flex justify-end">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            task.priority === Priority.High ? 'bg-red-500/20 text-red-400' :
            task.priority === Priority.Medium ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-blue-500/20 text-blue-400'
        }`}>
            {task.priority}
        </span>
      </div>
    </div>
  );
};
