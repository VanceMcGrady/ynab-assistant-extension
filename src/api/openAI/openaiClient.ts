import { OpenAI } from "openai";
import { getBudgets, getTransactions, getCategories } from "../ynab/ynabClient";
import { tools } from "./toolsSchema";
import { storeMessages } from "./memory";

import type { AIMessage } from "./types";

type ChatMessage = {
  text: string;
  type: "user" | "assistant";
};

// This function has been refactored to be the central point of interaction with the OpenAI API.
// It now accepts the entire chat history and a conversation ID, which it uses to maintain context
// and persist conversations. This approach simplifies the client-side logic and ensures that
// the assistant has a consistent memory of the conversation.
export async function callOpenAI(
  chatHistory: ChatMessage[],
  conversationId: string
) {
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

  const messagesForApi: AIMessage[] = chatHistory.map((msg) => ({
    role: msg.type,
    content: msg.text,
  }));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesForApi,
      tools: toolsSchema,
      tool_choice: "auto",
    });
    const responseMessage = response.choices[0].message;
    const responseMessageContent = responseMessage.content;

    const lastUserMessage = chatHistory[chatHistory.length - 1];

    const messagesToStore: AIMessage[] = [
      { role: "user", content: lastUserMessage.text },
    ];

    if (responseMessageContent) {
      messagesToStore.push({
        role: "assistant",
        content: responseMessageContent,
      });
    }
    // TODO: Handle tool calls, where content might be null

    await storeMessages(messagesToStore, conversationId);

    return responseMessageContent;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
