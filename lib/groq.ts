const GROQ_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter((key): key is string => Boolean(key));

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// Round-robins across keys so a single key's rate limit doesn't stall the demo.
let cursor = 0;

export type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

export async function askGroq(messages: GroqMessage[], maxTokens = 400): Promise<string> {
  if (GROQ_KEYS.length === 0) {
    throw new Error("No GROQ_API_KEY_* configured in .env.local");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < GROQ_KEYS.length; attempt++) {
    const key = GROQ_KEYS[cursor % GROQ_KEYS.length];
    cursor++;

    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          max_tokens: maxTokens,
          temperature: 0.6,
        }),
      });

      if (res.status === 429 || res.status === 401 || res.status >= 500) {
        lastError = new Error(`Groq key ${cursor % GROQ_KEYS.length} failed with ${res.status}`);
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Groq request failed: ${res.status} ${body}`);
      }

      const data = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      return data.choices[0]?.message?.content?.trim() ?? "";
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All Groq keys failed");
}
