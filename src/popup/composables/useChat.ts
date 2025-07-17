import { ref, onMounted } from "vue";
import { callOpenAI } from "@/api/openAI/openaiClient";
import { getMessages } from "@/api/openAI/memory";
import { v4 as uuidv4 } from "uuid";

// This composable encapsulates the core chat functionality, including state management for
// chat history, loading status, and conversation tracking. By centralizing this logic,
// it promotes reusability and simplifies the main App component.
export function useChat() {
  const chatHistory = ref<Array<{ text: string; type: "user" | "assistant" }>>([]);
  const isLoading = ref(false);
  // A unique identifier for the current conversation, allowing for persistent chat sessions.
  const conversationId = ref(uuidv4());

  // Fetches historical messages for the current conversation when the component mounts.
  onMounted(async () => {
    const messages = await getMessages(conversationId.value);
    chatHistory.value = messages.map((message) => ({
      text: message.content,
      type: message.role as "user" | "assistant",
    }));
  });

  // Handles the user's query, orchestrating the communication with the OpenAI API
  // and updating the chat history with both the user's message and the assistant's response.
  const handleAsk = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    const userMessage = { text: query, type: "user" as const };
    chatHistory.value.push(userMessage);

    isLoading.value = true;

    try {
      const openAIResponse = await callOpenAI(
        chatHistory.value,
        conversationId.value
      );
      if (openAIResponse) {
        const assistantMessage = {
          text: openAIResponse,
          type: "assistant" as const,
        };
        chatHistory.value.push(assistantMessage);
      }
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      chatHistory.value.push({
        text: "Error fetching response. Please try again.",
        type: "assistant" as const,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const startNewChat = () => {
    chatHistory.value = [];
    conversationId.value = uuidv4();
  };

  return {
    chatHistory,
    isLoading,
    handleAsk,
    startNewChat,
  };
}
