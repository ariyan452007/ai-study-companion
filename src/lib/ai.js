const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateAIContent(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content from AI API.');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error(error.message || "An unexpected error occurred during AI generation.");
  }
}

export function buildPrompt(tool, content) {
  switch (tool) {
    case 'Summary':
      return `You are an expert tutor. Please provide a clear, concise, and structured summary of the following study notes/content. Use bullet points for key concepts.\n\nContent:\n${content}`;
    case 'Flashcards':
      return `You are an expert tutor. Create 3 to 5 study flashcards based on the following content. Format them strictly as:\nQ: [Question]\nA: [Answer]\n\nContent:\n${content}`;
    case 'Questions':
      return `You are an expert tutor. Generate 3 to 5 challenging practice questions based on the following content to test my understanding. Do not provide the answers immediately.\n\nContent:\n${content}`;
    default:
      return content;
  }
}