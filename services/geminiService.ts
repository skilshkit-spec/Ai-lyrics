import { GoogleGenAI } from "@google/genai";
import { SongRequest, GeneratedSong } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOdiaLyrics = async (request: SongRequest): Promise<GeneratedSong> => {
  const modelId = "gemini-2.5-flash"; // Using Flash for speed and good creative capability

  const prompt = `
    Role: You are a professional Human Odia Songwriter (not a poet, a modern lyricist). You write raw, emotional, and catchy songs. You strictly avoid "AI-style" stiff language. You hate bookish words.

    Task: Write a complete song in **Odia Script** (Odia Language) about "${request.topic}".

    Context:
    - Mood (Emotion): ${request.mood}
    - Genre (Style): ${request.genre}
    - Length: ${request.length}

    *** 1. STRICT RHYMING LOGIC (AABB SCHEME) - PERFECT RHYMES ONLY ***
    You MUST follow the AABB rhyming scheme. 
    - **Line 1 & 2**: MUST rhyme perfectly at the end.
    - **Line 3 & 4**: MUST rhyme perfectly at the end.
    - **Phonetic Matching**: The last syllables must sound EXACTLY the same.
      - ✅ Correct: "Dure" - "Jhure" (Matches 'ure')
      - ✅ Correct: "Mana" - "Bana" (Matches 'ana')
      - ❌ Wrong: "Katha" - "Pai" (No match)
    
    *** 2. ULTRA-LOGICAL FLOW & COUPLET UNITY (CRITICAL) ***
    Every two lines (the rhyming pair) must form ONE COMPLETE THOUGHT. They cannot be random sentences.
    - **Couplet Logic**: 
      - ❌ BAD: "The sky is blue (Akasha Nila)" / "I eat an apple (Khauchi Phala)". -> (Rhymes but NO LOGIC).
      - ✅ GOOD: "Since you went far away (Tu Galu Dura)" / "My heart is only crying more (Kanduchi Mora)". -> (Connected Logical Thought).
    - **Conversation Style**: Write exactly like a person speaks. Line 2 should often complete the sentence started in Line 1.
    - **Story Progression**:
      - Verse 1: Introduction (What is the situation?)
      - Chorus: The Main Emotion/Hook (The core message).
      - Verse 2: Deepening the feeling or conflict.
      - Outro: Final conclusion.

    *** 3. GENRE-SPECIFIC VOCABULARY & STYLE ***
    - **Ollywood Commercial / Pop**: Modern, conversational Odia (Chalti Odia). Trendy.
    - **Sambalpuri**: Use authentic Sambalpuri/Kosli dialect keywords (Mui, Tui, Rani, Darling). Rhythmic.
    - **Bhajana**: Use pure, spiritual words (Prabhu, Bhakti, Charana). Respectful.
    - **Item Song**: Dance slang, catchy hooks, teasing lyrics.
    - **Rap / Hip-Hop**: Street slang, fast flow, aggressive or punchy words.
    - **Lofi**: Simple, soft, relaxing, poetic but modern words.
    - **Ghazal**: Deep Urdu-influenced Odia or pure poetic Odia.
    - **Jatra**: Dramatic, high-pitch, dialogue-heavy storytelling words.
    - **Classic**: Standard literary Odia, polite and melodious.

    *** 4. HUMAN TOUCH & VOCABULARY (CRITICAL) ***
    - **NO ROBOTIC / AI LANGUAGE**: Do not use formal, stiff, or "translated" text. The lyrics must sound like a real person talking.
    - **NO "CLASSIC" / BOOKISH WORDS**: Unless the genre is 'Classic' or 'Bhajana', DO NOT use formal literary words (like 'Bichitra', 'Kimbaba', 'Byathita'). Use words young people use (like 'Khel', 'Pila', 'Dil', 'Mast').
    - **CONVERSATIONAL TONE**: Write as if you are talking to a friend or lover. Use slang, idioms, and natural expressions.
    - **EMOTION OVER DESCRIPTION**: Don't say "I am feeling sad". Say "My heart is breaking into pieces". Show, don't tell.

    *** 5. STRUCTURE ***
    - Use clear English labels: [Title], [Verse 1], [Chorus], [Verse 2], [Bridge], [Outro].
    - Give the song a catchy **Title** in Odia at the top.
    
    *** 6. GRAMMAR & PRONUNCIATION (Natural Flow) ***
    - Ensure the sentence structure follows NATIVE Odia grammar (Subject-Object-Verb).
    - The lyrics must be "Singable". Read it internally to check the meter and rhythm.

    Output ONLY the lyrics in Odia script (with structural labels in English).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.7, // Lowered slightly to improve logical coherence and rhyming strictness
        topK: 40,
        topP: 0.95,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");

    // Simple parsing to extract a title if possible, otherwise use the topic
    const lines = text.split('\n');
    let title = lines[0]?.replace(/^#|\*/g, '').trim() || request.topic;
    
    // Cleanup title if it starts with "Title:"
    if (title.toLowerCase().startsWith('title:')) {
      title = title.substring(6).trim();
    }
    
    return {
      id: crypto.randomUUID(),
      title,
      lyrics: text,
      createdAt: Date.now(),
      metadata: request
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate lyrics. Please try again.");
  }
};
