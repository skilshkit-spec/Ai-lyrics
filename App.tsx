import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Music, Sparkles, Mic2, PenTool, Music2, Wand2, 
  Loader2, Clock, Copy, Download, Check, Edit2, 
  Save, X, ArrowRightLeft, History, Trash2 
} from 'lucide-react';

// ==========================================
// 1. TYPES & CONFIGURATION
// ==========================================

export enum Mood {
  ROMANTIC = 'Romantic / Love',
  SAD = 'Sad / Heartbroken',
  HAPPY = 'Happy / Cheerful',
  ENERGETIC = 'Energetic / Excitement',
  SPIRITUAL = 'Spiritual / Devotional',
  INSPIRATIONAL = 'Inspirational / Motivating',
  PATRIOTIC = 'Patriotic / Desha Bhakti',
  FUNNY = 'Funny / Comedy',
  ANGRY = 'Angry / Aggressive',
}

export enum Genre {
  OLLYWOOD = 'Ollywood Commercial (Pop)',
  SAMBALPURI = 'Sambalpuri (Folk)',
  BHAJANA = 'Bhajana (Traditional)',
  ITEM = 'Item Song (Dance Number)',
  RAP = 'Rap / Hip-Hop',
  ROCK = 'Rock / Band Style',
  LOFI = 'Lofi (Slow Reverb)',
  GHAZAL = 'Ghazal / Shayari Style',
  JATRA = 'Jatra (Opera Style)',
  CLASSIC = 'Classic (Old School 90s)',
}

export enum SongLength {
  SHORT = 'Short (1-2 mins)',
  MEDIUM = 'Medium (3-4 mins)',
  LONG = 'Long (5 mins)',
  EXTENDED = 'Extended (6+ mins)',
}

export interface SongRequest {
  topic: string;
  mood: Mood;
  genre: Genre;
  length: SongLength;
}

export interface GeneratedSong {
  id: string;
  title: string;
  lyrics: string;
  createdAt: number;
  metadata: SongRequest;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  currentSong: GeneratedSong | null;
  history: GeneratedSong[];
}

const STORAGE_KEY = 'odia_sur_history';

// ==========================================
// 2. AI SERVICE LOGIC (THE TRAINED BRAIN)
// ==========================================

const generateOdiaLyrics = async (request: SongRequest): Promise<GeneratedSong> => {
  // Initialize AI Client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-2.5-flash"; 

  // Determine structure based on length
  let structureConfig = "";
  if (request.length.includes("Extended") || request.length.includes("6+")) {
      structureConfig = `
      **EXTENDED MOVIE SONG STRUCTURE (6+ Minutes):**
      1. **Title:** Catchy Odia Title.
      2. **[Chorus]:** 4-6 Lines. Strong Hook. AABB Rhyme. High Energy.
      3. **[Verse 1]:** 8 Lines. Detailed storytelling. Set the scene clearly.
      4. **[Chorus Return]:** 2 Lines of Chorus.
      5. **[Verse 2]:** 8 Lines. Deepen the emotion or conflict.
      6. **[Bridge]:** 4 Lines. A change in tempo or perspective.
      7. **[Verse 3]:** 8 Lines. Emotional Climax.
      8. **[Verse 4]:** 8 Lines. Final resolution or philosophical thought.
      9. **[Outro]:** 4 Lines. Slow fade out.
      `;
  } else if (request.length.includes("Long")) {
      structureConfig = `
      **LONG SONG STRUCTURE (5 Minutes):**
      1. **Title:** Catchy Odia Title.
      2. **[Chorus]:** 4 Lines. AABB Rhyme.
      3. **[Verse 1]:** 6-8 Lines. Detailed story.
      4. **[Chorus Return]:** 2 Lines.
      5. **[Verse 2]:** 6-8 Lines. Deep emotion.
      6. **[Verse 3]:** 6-8 Lines. Conclusion.
      7. **[Outro]:** 4 Lines.
      `;
  } else if (request.length.includes("Medium")) {
      structureConfig = `
      **MEDIUM SONG STRUCTURE:**
      1. **Title:** Catchy Odia Title.
      2. **[Chorus]:** 4 Lines. AABB Rhyme.
      3. **[Verse 1]:** 4-6 Lines.
      4. **[Chorus Return]:** 2 Lines.
      5. **[Verse 2]:** 4-6 Lines.
      6. **[Outro]:** 2 Lines.
      `;
  } else {
      structureConfig = `
      **SHORT SONG STRUCTURE:**
      1. **Title:** Catchy Odia Title.
      2. **[Chorus]:** 4 Lines. AABB Rhyme.
      3. **[Verse 1]:** 4-6 Lines.
      4. **[Outro]:** 2 Lines.
      `;
  }

  // THE TRAINED PROMPT
  const prompt = `
    You are the AI incarnation of legendary Odia Lyricists like **Arun Mantri**, **Nirmala Nayak**, and **Abhijit Majumdar**.
    Your task is to write a BLOCKBUSTER OLLYWOOD SONG that sounds authentic, emotional, and professionally composed.

    **CRITICAL RULES FOR QUALITY (DO NOT IGNORE):**

    1. **FORMATTING & LANGUAGE:**
       - **LABELS:** Use **ENGLISH** labels only (e.g., **[Chorus]**, **[Verse 1]**, **[Bridge]**, **[Outro]**).
       - **NO INDIC TERMS:** Do NOT use words like 'Mukhra', 'Antara', or 'Sanchari'.
       - **SCRIPT:** The lyrics content MUST be in **PURE ODIA SCRIPT (ଓଡ଼ିଆ ଲିପି)**.
       - **NO ROMAN ODIA:** Do NOT write lyrics in English letters (e.g., "Mu jauchi" is BANNED).
       - ✅ Example Label: **[Chorus]**
       - ✅ Example Lyric: **ତୁମେ ଆସିଲ ବେଳେ ମନ ମୋର ନାଚେ...**

    2. **PERFECT RHYMING (ANTYA MILANA):**
       - **Rule:** The song MUST be singable. Lines must have a similar syllable count (Meter).
       - **Rhyme Scheme:** Use **AABB** strictly for the [Chorus].
       - **Phonetics:** The ending **VOWEL SOUND** must match exactly.
         - ❌ Bad: "Katha... / Hrudaya..." ('tha' and 'ya' do not rhyme well).
         - ✅ Good: "Katha... / Byatha..." (Perfect match).
       - **Correction Strategy:** If you write a line, and the next line doesn't rhyme perfectly, DELETE IT and write a new line that rhymes.

    3. **CORRECT SPELLING & GRAMMAR (SHUDDHA ODIA):**
       - **Matra Fixes:** 
         - Use correct verb endings. 'ମୁଁ ଯାଉଛି' (Continuous), not 'ମୁଁ ଯାଇଛି' (Perfect) unless intended.
         - Watch 'i' vs 'ii' (ି vs ୀ) and 'u' vs 'uu' (ୁ vs ୂ).
       - **Pronunciation:** Write words as they are pronounced in songs.
       - **Sentence Logic:** Complete the sentence. Don't leave it hanging.

    4. **LYRICIST PERSONA & STYLE:**
       - **If Romantic:** Use soft, poetic words like *Janha, Phula, Sagara, Nida, Swapna, Akhi*. Be emotional.
       - **If Sad:** Use deep words like *Luha, Koha, Chhati Fata, Smruti, Jala, Sunya*.
       - **If Dance/Folk:** Use energetic, desi words like *Toka, Toki, Halchal, Bawal, Mui, Tui, Rani*.
       - **Logic:** Think like a movie scene. Visualize the actor singing.

    5. **CONTEXTUAL WORD BANK (NO ROBOTIC WORDS):**
       - Use: *Dhana, Suna, Jibana, Sathi, Manara Katha, Prema Chadhei*.
       - **BANNED:** 'Network', 'Computer', 'Link', 'Database', 'System'.
       - **BANNED:** Direct translation of English idioms. Use Odia 'Rudhi' (Idioms).

    **SONG REQUEST DETAILS:**
    - Topic: "${request.topic}"
    - Mood: ${request.mood}
    - Genre: ${request.genre}
    - Length: ${request.length}

    **OUTPUT FORMAT:**
    ${structureConfig}

    **FINAL CHECK:** 
    - Are the labels [Chorus]/[Verse]? YES.
    - Is the script Odia? YES.
    - Is Roman Odia removed? YES.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.7, 
        topK: 40,
        topP: 0.90,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");

    // Extract title or use default
    const lines = text.split('\n');
    let title = lines[0]?.replace(/^#|\*|Title:/g, '').trim() || request.topic;
    
    return {
      id: crypto.randomUUID(),
      title,
      lyrics: text,
      createdAt: Date.now(),
      metadata: request
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.status === 403 || (error.message && error.message.includes("PERMISSION_DENIED"))) {
        throw new Error("API Permission Denied. Please check if your API Key is valid and has access to the model.");
    }
    throw new Error("Failed to generate lyrics. Please try again.");
  }
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const Header: React.FC = () => {
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
            <p className="text-xs text-slate-400">Ollywood Songwriter</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

interface InputFormProps {
  onGenerate: (request: SongRequest) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
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
        <h2 className="text-lg font-semibold text-white">Compose Song</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Song Topic / Situation
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Hero teasing Heroine in college..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 pl-11 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              required
            />
            <PenTool className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Mood</label>
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
            <label className="block text-sm font-medium text-slate-300">Style</label>
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
          <label className="block text-sm font-medium text-slate-300">Duration</label>
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
              <span>Writing Lyrics...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate Hit Song</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

interface LyricsCardProps {
  song: GeneratedSong;
  onUpdateSong: (updatedSong: GeneratedSong) => void;
}

const LyricsCard: React.FC<LyricsCardProps> = ({ song, onUpdateSong }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState(song.lyrics);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

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
    onUpdateSong({ ...song, lyrics: editedLyrics });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLyrics(song.lyrics);
    setIsEditing(false);
  };

  const handleReplace = () => {
    if (!findText) return;
    try {
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

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================

function App() {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    currentSong: null,
    history: []
  });

  // Load history
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

  // Save history
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
        history: [newSong, ...s.history].slice(0, 10)
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
    if (window.confirm("Clear all history?")) {
      setState(s => ({ ...s, history: [] }));
    }
  };

  const handleDeleteSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this song?")) {
      setState(s => {
        const newHistory = s.history.filter(h => h.id !== songId);
        const newCurrent = s.currentSong?.id === songId ? null : s.currentSong;
        return { ...s, history: newHistory, currentSong: newCurrent };
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-pink-500/30 selection:text-pink-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & History */}
          <div className="lg:col-span-4 space-y-8">
            <InputForm 
              onGenerate={handleGenerate} 
              isLoading={state.isLoading} 
            />
            
            {/* Desktop History */}
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
                    title="Clear All"
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
                        title="Delete"
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
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                 ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
