import React from 'react';
import { PythonIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-300/10 shadow-lg p-4">
      <div className="container mx-auto flex items-center">
        <PythonIcon className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">PyTask</span> Manager
        </h1>
      </div>
    </header>
  );
};
