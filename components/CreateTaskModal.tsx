
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import type { Task } from '../types';
import { Priority, Status } from '../types';
import { PRIORITIES } from '../constants';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  projectId: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onAddTask, projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        projectId,
        title,
        description,
        status: Status.ToDo,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority(Priority.Medium);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="def create_task():">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-300 mb-1">
            title: str
          </label>
          <input
            id="taskTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-300 mb-1">
            description: str
          </label>
          <textarea
            id="taskDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-300 mb-1">
            priority: Priority
          </label>
          <select
            id="taskPriority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            return None
          </button>
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-md transition-colors">
            return Task
          </button>
        </div>
      </form>
    </Modal>
  );
};
