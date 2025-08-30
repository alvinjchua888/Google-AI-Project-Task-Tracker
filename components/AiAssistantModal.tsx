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
        <p className="text-slate-400">
          Let the AI assistant generate some task ideas for your project: <span className="text-cyan-400 font-semibold">{project.name}</span>
        </p>
        
        {!isLoading && suggestions.length === 0 && (
          <button onClick={handleGenerate} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
            <SparklesIcon className="h-5 w-5" />
            Generate Suggestions
          </button>
        )}

        {isLoading && <div className="text-center text-slate-300 animate-pulse"># Generating tasks... please wait...</div>}
        {error && <div className="text-center text-red-400 bg-red-500/10 p-2 rounded-md">{error}</div>}

        {suggestions.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {suggestions.map((s, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-slate-900/50 rounded-md">
                <input
                  id={`task-suggestion-${index}`}
                  type="checkbox"
                  checked={selectedTasks.includes(index)}
                  onChange={() => handleToggleTask(index)}
                  className="mt-1 h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                />
                <label htmlFor={`task-suggestion-${index}`} className="flex-1 cursor-pointer">
                  <h4 className="font-semibold text-slate-100">{s.title}</h4>
                  <p className="text-sm text-slate-400">{s.description}</p>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            return None
          </button>
          {suggestions.length > 0 && (
            <button onClick={handleAddTasks} disabled={selectedTasks.length === 0} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed">
              Add {selectedTasks.length} Tasks
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
