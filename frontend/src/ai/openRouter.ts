const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export async function getChartSuggestions(prompt: string) {
  function extractFirstJsonBlock(text: string): string | null {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) return null;

  return text.slice(start, end + 1);
};
    const body = {
    model: "google/gemma-2-9b-it:free", // Or try "openai/gpt-3.5-turbo"
    messages: [
      {
        role: "system",
        content: "You are a data visualization assistant that suggests useful chart configurations in JSON format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000/", // For tracking, required by OpenRouter
      "X-Title": "collab-data-dashboard",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) throw new Error("Failed to get chart suggestions");

  const json = await response.json();
  const message = json.choices?.[0]?.message?.content || "";
  console.log("OpenRouter raw response:", message);
  const jsonBlock = extractFirstJsonBlock(message);
if (!jsonBlock) throw new Error("No valid JSON found");

  try {
    return JSON.parse(jsonBlock);
  } catch (e) {
    console.error("OpenRouter did not return valid JSON:", message);
    throw new Error("Invalid JSON response from AI");
  }
}
