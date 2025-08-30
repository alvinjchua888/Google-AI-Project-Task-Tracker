import React, { useState } from 'react';
import type { Project, Task } from '../types';
import { KanbanBoard } from './KanbanBoard';
import { CreateProjectModal } from './CreateProjectModal';
import { CreateTaskModal } from './CreateTaskModal';
import { AiAssistantModal } from './AiAssistantModal';
import { PlusIcon, SparklesIcon, CodeBracketIcon } from './IconComponents';

interface ProjectViewProps {
  projects: Project[];
  selectedProject: Project | null;
  tasks: Task[];
  onSelectProject: (projectId: string) => void;
  onAddProject: (name: string, description: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onAddMultipleTasks: (tasks: Omit<Task, 'id'>[]) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  projects,
  selectedProject,
  tasks,
  onSelectProject,
  onAddProject,
  onAddTask,
  onAddMultipleTasks,
  onUpdateTaskStatus,
}) => {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isAiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-cyan-400">Projects</h2>
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={projects.length === 0}
            aria-label="Select a project"
          >
            {projects.length === 0 ? (
                <option>No projects yet</option>
            ) : (
                projects.map((p) => (
                    <option key={p.id} value={p.id}>
                    {p.name}
                    </option>
                ))
            )}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
           <button
            onClick={() => setProjectModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            New Project
          </button>
          {selectedProject && (
            <>
              <button
                onClick={() => setTaskModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
              >
                 <PlusIcon className="h-5 w-5" />
                Add Task
              </button>
              <button
                onClick={() => setAiModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
              >
                <SparklesIcon className="h-5 w-5" />
                AI Assistant
              </button>
            </>
          )}
        </div>
      </div>

      {selectedProject ? (
        <div className="flex-grow overflow-x-auto">
          <p className="text-slate-400 mb-4 ml-1"># {selectedProject.description}</p>
          <KanbanBoard tasks={tasks} onUpdateTaskStatus={onUpdateTaskStatus} />
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center bg-slate-800/50 rounded-lg p-8 text-center">
          <CodeBracketIcon className="h-16 w-16 text-slate-600 mb-4" />
          <p className="text-slate-400 text-xl font-semibold">
            Welcome to PyTask Manager
          </p>
          <p className="text-slate-500 mt-1">Select a project to see tasks or create a new one to get started.</p>
        </div>
      )}

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onAddProject={onAddProject}
      />
      {selectedProject && (
        <>
            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                onAddTask={onAddTask}
                projectId={selectedProject.id}
            />
            <AiAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setAiModalOpen(false)}
                project={selectedProject}
                onAddMultipleTasks={onAddMultipleTasks}
            />
        </>
      )}
    </div>
  );
};
