import { GoogleGenAI } from "@google/genai";
import { SongRequest, GeneratedSong } from "../types";

export const generateOdiaLyrics = async (request: SongRequest): Promise<GeneratedSong> => {
  // Initialize the client inside the function to ensure the API key is picked up from the environment at runtime.
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

  // Prompt engineering focused on "Legendary Lyricist" persona with strict phonetic & spelling rules
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