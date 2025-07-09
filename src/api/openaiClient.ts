import { OpenAI } from "openai";

export async function callOpenAI(prompt: string) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
  console.log("Calling OpenAI with prompt:", prompt);
  console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
