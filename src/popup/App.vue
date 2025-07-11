<template>
  <div class="ynab-assistant-container">
    <Header />
    <ResponseDisplay :messages="chatHistory" />
    <QueryInput @ask="handleAsk" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "./components/Header.vue";
import QueryInput from "./components/QueryInput.vue";
import ResponseDisplay from "./components/ResponseDisplay.vue";
import { callOpenAI } from "@/api/openaiClient";

const chatHistory = ref<Array<{ text: string; type: 'user' | 'bot' }>>([]);
const isLoading = ref(false);

const handleAsk = async (query: string) => {
  if (!query.trim()) {
    return;
  }

  chatHistory.value.push({ text: query, type: "user" });
  isLoading.value = true;

  try {
    const openAIResponse = await callOpenAI(query);
    chatHistory.value.push({ text: openAIResponse, type: "bot" });
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    chatHistory.value.push({ text: "Error fetching response. Please try again.", type: "bot" });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.ynab-assistant-container {
  display: flex;
  flex-direction: column;
  height: 500px; /* Or adjust as needed */
  padding: 1rem;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
</style>