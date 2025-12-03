import React, { useState } from 'react';
import { SongRequest, Mood, Genre, SongLength } from '../types';
import { Mic2, PenTool, Music2, Wand2, Loader2, Sparkles, Clock } from 'lucide-react';

interface InputFormProps {
  onGenerate: (request: SongRequest) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.ROMANTIC);
  const [genre, setGenre] = useState<Genre>(Genre.OLLYWOOD);
  const [length, setLength] = useState<SongLength>(SongLength.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, mood, genre, length });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <Wand2 className="w-5 h-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">Create New Song</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            What is your song about?
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., First rain in Bhubaneswar, A mother's love..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 pl-11 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              required
            />
            <PenTool className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Mood (Emotion)</label>
            <div className="relative">
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 pl-11 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
              >
                {Object.values(Mood).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <Music2 className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Genre Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Genre (Style)</label>
            <div className="relative">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 pl-11 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
              >
                {Object.values(Genre).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <Mic2 className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Length Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Length</label>
          <div className="relative">
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as SongLength)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 pl-11 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
            >
              {Object.values(SongLength).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <Clock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
            ${isLoading 
              ? 'bg-slate-700 cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 shadow-violet-500/25'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Composing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate Lyrics</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};