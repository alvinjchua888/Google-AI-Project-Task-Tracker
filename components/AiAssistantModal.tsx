
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { generateTaskSuggestions } from '../services/geminiService';
import type { Project, Task, TaskSuggestion } from '../types';
import { Priority, Status } from '../types';
import { SparklesIcon } from './IconComponents';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAddMultipleTasks: (tasks: Omit<Task, 'id'>[]) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose, project, onAddMultipleTasks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setSelectedTasks([]);
    try {
      const result = await generateTaskSuggestions(project.name, project.description);
      setSuggestions(result);
      setSelectedTasks(result.map((_, index) => index)); // Select all by default
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (index: number) => {
    setSelectedTasks(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleAddTasks = () => {
    const tasksToAdd = suggestions
      .filter((_, index) => selectedTasks.includes(index))
      .map(suggestion => ({
        projectId: project.id,
        title: suggestion.title,
        description: suggestion.description,
        status: Status.ToDo,
        priority: Priority.Medium,
      }));
    onAddMultipleTasks(tasksToAdd);
    onClose();
    setSuggestions([]);
    setSelectedTasks([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="from gemini import TaskGenerator">
      <div className="space-y-4">
        <p className="text-gray-400">
          Let the AI assistant generate some task ideas for your project: <span className="text-yellow-400 font-semibold">{project.name}</span>
        </p>
        
        {!isLoading && suggestions.length === 0 && (
          <button onClick={handleGenerate} className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            <SparklesIcon className="h-5 w-5" />
            Generate Suggestions
          </button>
        )}

        {isLoading && <div className="text-center text-gray-300"># Generating tasks... please wait...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {suggestions.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {suggestions.map((s, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-gray-900 rounded-md">
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(index)}
                  onChange={() => handleToggleTask(index)}
                  className="mt-1 h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <h4 className="font-semibold text-gray-100">{s.title}</h4>
                  <p className="text-sm text-gray-400">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            return None
          </button>
          {suggestions.length > 0 && (
            <button onClick={handleAddTasks} disabled={selectedTasks.length === 0} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              Add {selectedTasks.length} Tasks
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
