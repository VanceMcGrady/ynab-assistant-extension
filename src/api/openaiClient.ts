import { OpenAI } from "openai";
import { getBudgets } from "./ynabClient";

export async function callOpenAI(prompt: string) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const tools = [
    {
      type: "function" as const,
      function: {
        name: "getBudgets",
        description: "Get a list of all budgets available in YNAB.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
  ];

  try {
    const messages: any[] = [{ role: "user", content: prompt }];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;

      if (functionName === "getBudgets") {
        const availableBudgets = await getBudgets();
        messages.push(responseMessage);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(availableBudgets),
        });

        const secondResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages,
        });
        return secondResponse.choices[0].message.content;
      }
    }

    return responseMessage.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
