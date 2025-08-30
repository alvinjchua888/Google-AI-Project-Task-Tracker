
import React, { useState } from 'react';
import type { Project, Task } from '../types';
import { KanbanBoard } from './KanbanBoard';
import { CreateProjectModal } from './CreateProjectModal';
import { CreateTaskModal } from './CreateTaskModal';
import { AiAssistantModal } from './AiAssistantModal';
import { PlusIcon, SparklesIcon } from './IconComponents';

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
          <h2 className="text-3xl font-bold text-yellow-400">Projects</h2>
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={projects.length === 0}
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
        <div className="flex items-center gap-2">
           <button
            onClick={() => setProjectModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            New Project
          </button>
          {selectedProject && (
            <>
              <button
                onClick={() => setTaskModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                 <PlusIcon className="h-5 w-5" />
                Add Task
              </button>
              <button
                onClick={() => setAiModalOpen(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
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
          <p className="text-gray-400 mb-4 ml-1"># {selectedProject.description}</p>
          <KanbanBoard tasks={tasks} onUpdateTaskStatus={onUpdateTaskStatus} />
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center bg-gray-800/50 rounded-lg">
          <p className="text-gray-400 text-xl">
            Select a project to see tasks or create a new one to get started.
          </p>
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
