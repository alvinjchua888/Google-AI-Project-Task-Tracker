import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectView } from './components/ProjectView';
import type { Project, Task } from './types';

// Simple UUID generator
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage on initial render
    try {
      const storedProjects = localStorage.getItem('pytask-projects');
      const storedTasks = localStorage.getItem('pytask-tasks');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
        if (parsedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(parsedProjects[0].id);
        }
      }
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    try {
      localStorage.setItem('pytask-projects', JSON.stringify(projects));
      localStorage.setItem('pytask-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [projects, tasks]);


  const addProject = (name: string, description: string) => {
    const newProject: Project = { id: uuidv4(), name, description };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    if (!selectedProjectId) {
      setSelectedProjectId(newProject.id);
    }
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: uuidv4() };
    setTasks([...tasks, newTask]);
  };
  
  const addMultipleTasks = (newTasks: Omit<Task, 'id'>[]) => {
    const tasksToAdd: Task[] = newTasks.map(t => ({ ...t, id: uuidv4() }));
    setTasks(prevTasks => [...prevTasks, ...tasksToAdd]);
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
  const projectTasks = tasks.filter(task => task.projectId === selectedProjectId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <ProjectView
          projects={projects}
          selectedProject={selectedProject}
          tasks={projectTasks}
          onSelectProject={setSelectedProjectId}
          onAddProject={addProject}
          onAddTask={addTask}
          onAddMultipleTasks={addMultipleTasks}
          onUpdateTaskStatus={updateTaskStatus}
        />
      </main>
    </div>
  );
};

export default App;
