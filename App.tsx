import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LyricsCard } from './components/LyricsCard';
import { SongRequest, GeneratedSong, GenerationState } from './types';
import { generateOdiaLyrics } from './services/geminiService';
import { History, Trash2, ArrowRight, Music } from 'lucide-react';

const STORAGE_KEY = 'odia_sur_history';

function App() {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    currentSong: null,
    history: []
  });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(s => ({ ...s, history: parsed }));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
  }, [state.history]);

  const handleGenerate = async (request: SongRequest) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const newSong = await generateOdiaLyrics(request);
      setState(s => ({
        ...s,
        isLoading: false,
        currentSong: newSong,
        history: [newSong, ...s.history].slice(0, 10) // Keep last 10
      }));
    } catch (error: any) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error.message || "Something went wrong"
      }));
    }
  };

  const handleUpdateSong = (updatedSong: GeneratedSong) => {
    setState(s => ({
      ...s,
      currentSong: updatedSong,
      history: s.history.map(h => h.id === updatedSong.id ? updatedSong : h)
    }));
  };

  const handleSelectHistory = (song: GeneratedSong) => {
    setState(s => ({ ...s, currentSong: song }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your song history?")) {
      setState(s => ({ ...s, history: [] }));
    }
  };

  const handleDeleteSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the song when clicking delete
    if (window.confirm("Remove this song from history?")) {
      setState(s => {
        const newHistory = s.history.filter(h => h.id !== songId);
        // If the deleted song is the one currently showing, clear the view
        const newCurrent = s.currentSong?.id === songId ? null : s.currentSong;
        return {
          ...s,
          history: newHistory,
          currentSong: newCurrent
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-pink-500/30 selection:text-pink-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-8">
            <InputForm 
              onGenerate={handleGenerate} 
              isLoading={state.isLoading} 
            />
            
            {/* History Panel (Desktop: Below input, Mobile: Below results usually, but here in sidebar column) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <History className="w-5 h-5" />
                  <h3 className="font-semibold">Recent Songs</h3>
                </div>
                {state.history.length > 0 && (
                  <button 
                    onClick={handleClearHistory}
                    className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-red-400"
                    title="Clear All History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {state.history.length === 0 ? (
                  <p className="text-sm text-slate-500 italic text-center py-4">No songs generated yet.</p>
                ) : (
                  state.history.map(song => (
                    <div key={song.id} className="relative group">
                      <button
                        onClick={() => handleSelectHistory(song)}
                        className={`w-full text-left p-3 pr-10 rounded-lg text-sm transition-all border ${
                          state.currentSong?.id === song.id 
                          ? 'bg-slate-800 border-violet-500/50 text-violet-300' 
                          : 'bg-slate-800/30 border-transparent hover:bg-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="font-odia font-medium truncate">{song.title}</div>
                        <div className="text-xs opacity-70 mt-1 flex justify-between">
                          <span>{song.metadata.genre}</span>
                          <span>{new Date(song.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => handleDeleteSong(song.id, e)}
                        className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                        title="Delete Song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 min-h-[500px]">
            {state.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6">
                <p>{state.error}</p>
              </div>
            )}

            {state.currentSong ? (
              <LyricsCard 
                song={state.currentSong} 
                onUpdateSong={handleUpdateSong}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                  <Music className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready to Compose</h3>
                <p className="text-slate-500 max-w-md">
                  Enter a topic, choose a mood, and let AI write your next Odia hit song.
                </p>
                <div className="mt-8 flex items-center space-x-8 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <span>Sambalpuri</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                    <span>Bhajana</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Modern</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile History View */}
            <div className="lg:hidden mt-12">
              <div className="flex items-center justify-between mb-4 px-2">
                 <h3 className="font-semibold text-slate-300">Recent History</h3>
                 {state.history.length > 0 && (
                    <button onClick={handleClearHistory} className="text-xs text-red-400">Clear All</button>
                 )}
              </div>
              <div className="flex overflow-x-auto pb-4 space-x-4 px-2 no-scrollbar">
                 {state.history.map(song => (
                    <div key={song.id} className="relative flex-shrink-0 w-64 group">
                      <button
                        onClick={() => handleSelectHistory(song)}
                        className="w-full text-left bg-slate-800/50 border border-slate-700 p-4 rounded-xl pr-10"
                      >
                         <div className="font-odia font-medium text-slate-200 truncate mb-1">{song.title}</div>
                         <div className="text-xs text-slate-500">{song.metadata.mood}</div>
                      </button>
                      <button
                        onClick={(e) => handleDeleteSong(song.id, e)}
                        className="absolute top-2 right-2 p-2 text-slate-500 hover:text-red-400"
                        title="Delete Song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                 ))}
                 {state.history.length === 0 && (
                    <div className="text-slate-600 text-sm px-2">No history yet.</div>
                 )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;