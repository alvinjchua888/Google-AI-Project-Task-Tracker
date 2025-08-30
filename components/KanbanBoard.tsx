import React, { useState } from 'react';
import type { Task } from '../types';
import { Status } from '../types';
import { STATUSES } from '../constants';
import { TaskCard } from './TaskCard';
import { DocumentIcon, CogIcon, CheckCircleIcon } from './IconComponents';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
}

const getColumnStyles = (status: Status): { border: string; icon: React.ReactNode } => {
  switch (status) {
    case Status.ToDo:
      return {
        border: 'border-slate-500',
        icon: <DocumentIcon className="h-5 w-5 text-slate-500" />,
      };
    case Status.InProgress:
      return {
        border: 'border-blue-500',
        icon: <CogIcon className="h-5 w-5 text-blue-500" />,
      };
    case Status.Done:
      return {
        border: 'border-green-500',
        icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      };
    default:
      return { border: 'border-gray-500', icon: null };
  }
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
      {STATUSES.map((status) => {
        const { border, icon } = getColumnStyles(status);
        const tasksInColumn = tasks.filter((t) => t.status === status);
        return (
          <div 
            key={status} 
            className={`rounded-xl p-4 bg-slate-800/60 transition-colors duration-300 border-t-4 ${border} ${draggedOverColumn === status ? 'bg-slate-700/80' : ''}`}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(status)}
            onDragLeave={handleDragLeave}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-semibold text-slate-200">
                  {status}
                </h3>
              </div>
              <span className="text-sm bg-slate-700 text-slate-400 rounded-full px-2 py-0.5">{tasksInColumn.length}</span>
            </div>
            <div className="space-y-4 min-h-[100px]">
              {tasksInColumn
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        )
      })}
    </div>
  );
};
