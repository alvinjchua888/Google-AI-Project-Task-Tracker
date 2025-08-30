import React, { useState } from 'react';
import { Modal } from './common/Modal';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (name: string, description: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onAddProject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onAddProject(name, description);
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="def create_project():">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-1">
            project_name: str
          </label>
          <input
            id="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-300 mb-1">
            project_description: str
          </label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            return None
          </button>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
            return Project
          </button>
        </div>
      </form>
    </Modal>
  );
};
