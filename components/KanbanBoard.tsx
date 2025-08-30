import React, { useState } from 'react';
import type { Task } from '../types';
import { Status } from '../types';
import { STATUSES } from '../constants';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
}

const statusColorMap: Record<Status, string> = {
  [Status.ToDo]: 'bg-gray-700',
  [Status.InProgress]: 'bg-blue-800',
  [Status.Done]: 'bg-green-800',
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateTaskStatus }) => {
  const [draggedOverColumn, setDraggedOverColumn] = useState<Status | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');
    if (taskId && sourceStatus !== status) {
      onUpdateTaskStatus(taskId, status);
    }
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (status: Status) => {
    setDraggedOverColumn(status);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STATUSES.map((status) => (
        <div 
          key={status} 
          className={`rounded-lg p-4 ${statusColorMap[status]} transition-colors duration-300 ${draggedOverColumn === status ? 'bg-gray-600/80' : ''}`}
          onDrop={(e) => handleDrop(e, status)}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(status)}
          onDragLeave={handleDragLeave}
        >
          <h3 className="text-lg font-bold text-yellow-400 mb-4 border-b-2 border-gray-600 pb-2">
            {status} ({tasks.filter((t) => t.status === status).length})
          </h3>
          <div className="space-y-4 min-h-[100px]">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
