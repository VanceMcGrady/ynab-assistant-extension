import { OpenAI } from "openai";
import { getBudgets, getTransactions, getCategories } from "../ynab/ynabClient";
import { tools } from "./toolsSchema";
import { getMessages, storeMessages } from "./memory";

import type { AIMessage } from "./types";

export async function callOpenAI(prompt: string) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Ensure you have set this in your environment variables
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const toolsSchema = tools;

  const availableFunctions: { [key: string]: Function } = {
    getBudgets,
    getTransactions,
    getCategories,
  };

  try {
    const messageHistory: AIMessage[] = await getMessages();

    const messages: AIMessage[] = [
      ...messageHistory,
      { role: "user", content: prompt },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      tools: toolsSchema,
      tool_choice: "auto",
    });
    const responseMessage = response.choices[0].message.content;
    storeMessages([
      { role: "user", content: prompt },
      { role: "assistant", content: responseMessage },
    ]);
    return responseMessage;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
