
import React from 'react';
import { PythonIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b-2 border-yellow-400 shadow-lg p-4">
      <div className="container mx-auto flex items-center">
        <PythonIcon className="h-8 w-8 text-blue-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
          <span className="text-yellow-400">Py</span>Task Manager
        </h1>
      </div>
    </header>
  );
};
