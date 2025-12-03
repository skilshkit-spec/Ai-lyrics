import React, { useState, useEffect } from 'react';
import { GeneratedSong } from '../types';
import { Copy, Download, Music, Check, Edit2, Save, X, ArrowRightLeft } from 'lucide-react';

interface LyricsCardProps {
  song: GeneratedSong;
  onUpdateSong: (updatedSong: GeneratedSong) => void;
}

export const LyricsCard: React.FC<LyricsCardProps> = ({ song, onUpdateSong }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState(song.lyrics);
  
  // Find and Replace state
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  // Reset local state when song changes
  useEffect(() => {
    setEditedLyrics(song.lyrics);
    setIsEditing(false);
    setFindText('');
    setReplaceText('');
  }, [song.id, song.lyrics]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedLyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedLyrics], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${song.title.replace(/\s+/g, '_')}_Lyrics.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSave = () => {
    onUpdateSong({
      ...song,
      lyrics: editedLyrics
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLyrics(song.lyrics);
    setIsEditing(false);
  };

  const handleReplace = () => {
    if (!findText) return;
    try {
      // Simple global replace
      const newLyrics = editedLyrics.split(findText).join(replaceText);
      setEditedLyrics(newLyrics);
    } catch (e) {
      console.error("Replace failed", e);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full animate-fade-in transition-all">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h2 className="text-2xl font-bold text-white font-odia leading-relaxed mb-1 truncate">
            {song.title}
          </h2>
          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
            <span className="bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
              {song.metadata.genre}
            </span>
            <span className="bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
              {song.metadata.mood}
            </span>
             <span className="bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
              {song.metadata.length}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           {!isEditing && (
             <button 
                onClick={() => setIsEditing(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                title="Edit Lyrics"
             >
                <Edit2 className="w-5 h-5" />
             </button>
           )}
           <div className="bg-gradient-to-br from-pink-500/20 to-violet-600/20 p-2 rounded-full hidden sm:block">
             <Music className="w-8 h-8 text-pink-400 opacity-75" />
           </div>
        </div>
      </div>

      {/* Editor / Viewer Content */}
      <div className="flex-grow bg-slate-900/30 flex flex-col relative overflow-hidden h-[600px]">
        {isEditing ? (
          <div className="flex flex-col h-full">
            {/* Find & Replace Toolbar */}
            <div className="bg-slate-800 border-b border-slate-700 p-3 flex flex-col sm:flex-row gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase mr-2">Word Replace:</span>
              <input 
                type="text" 
                placeholder="Find word..." 
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 flex-1 w-full sm:w-auto font-odia"
              />
              <ArrowRightLeft className="w-4 h-4 text-slate-500 hidden sm:block" />
              <input 
                type="text" 
                placeholder="Replace with..." 
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 flex-1 w-full sm:w-auto font-odia"
              />
              <button 
                onClick={handleReplace}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded shadow-lg transition-colors w-full sm:w-auto"
              >
                Replace All
              </button>
            </div>
            {/* Textarea */}
            <textarea
              value={editedLyrics}
              onChange={(e) => setEditedLyrics(e.target.value)}
              className="flex-grow w-full p-6 bg-slate-900/50 font-odia text-lg text-slate-200 whitespace-pre-wrap leading-loose font-medium focus:outline-none focus:bg-slate-900/80 resize-none"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="p-6 overflow-y-auto h-full">
            <pre className="font-odia text-lg text-slate-200 whitespace-pre-wrap leading-loose font-medium">
              {editedLyrics}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
        
        {isEditing ? (
          <div className="flex items-center space-x-3 w-full justify-end">
             <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm font-medium transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs text-slate-500 hidden sm:block">
              Odia Only Mode active.
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
