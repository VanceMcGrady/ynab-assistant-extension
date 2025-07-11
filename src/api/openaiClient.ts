import { OpenAI } from "openai";
import { getBudgets, getTransactions } from "./ynabClient";

export async function callOpenAI(prompt: string) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Ensure you have set this in your environment variables
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
    {
      type: "function" as const,
      function: {
        name: "getTransactions",
        description: "Get a list of all transactions for a given budget ID.",
        parameters: {
          type: "object",
          properties: {
            budgetId: {
              type: "string",
              description:
                "The ID of the budget to retrieve transactions from.",
            },
          },
          required: ["budgetId"],
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
      } else if (functionName === "getTransactions") {
        console.log("Tool call for getTransactions:", toolCall);
        const budgetId = JSON.parse(toolCall.function.arguments).budgetId;
        const transactions = await getTransactions(budgetId);
        messages.push(responseMessage);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(transactions),
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
