import React from 'react';
import { Music, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-pink-500 to-violet-600 p-2 rounded-lg shadow-lg shadow-pink-500/20">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              OdiaSur AI
            </h1>
            <p className="text-xs text-slate-400">Infinite Melodies</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Powered by Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};