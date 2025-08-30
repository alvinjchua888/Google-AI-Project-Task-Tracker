import React from 'react';
import type { Task } from '../types';
import { Priority } from '../types';

interface TaskCardProps {
  task: Task;
}

const priorityColorMap: Record<Priority, string> = {
  [Priority.High]: 'border-t-2 border-red-500',
  [Priority.Medium]: 'border-t-2 border-yellow-500',
  [Priority.Low]: 'border-t-2 border-sky-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceStatus', task.status);
    e.currentTarget.classList.add('opacity-50', 'scale-95');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-95');
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-slate-800 rounded-lg p-4 shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 ${priorityColorMap[task.priority]}`}>
      <h4 className="font-bold text-slate-100">{task.title}</h4>
      <p className="text-sm text-slate-400 mt-2 truncate">{task.description}</p>
      <div className="mt-4 flex justify-end">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            task.priority === Priority.High ? 'bg-red-500/20 text-red-400' :
            task.priority === Priority.Medium ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-sky-500/20 text-sky-400'
        }`}>
            {task.priority}
        </span>
      </div>
    </div>
  );
};
