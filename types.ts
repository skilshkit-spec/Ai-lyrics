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

// Mood = The Emotion / Feeling of the song
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

// Genre = The Musical Style / Arrangement
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
  LONG = 'Long (5+ mins)',
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  currentSong: GeneratedSong | null;
  history: GeneratedSong[];
}