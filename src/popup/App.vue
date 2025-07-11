<template>
  <div class="ynab-assistant-container">
    <h1 class="ynab-assistant-header">YNAB AI Assistant</h1>
    <textarea
      class="ynab-assistant-textarea"
      v-model="userQuery"
      placeholder="Ask something..."
    ></textarea>
    <button
      class="ynab-assistant-button"
      @click="fetchResponse"
      :disabled="isLoading"
    >
      <span v-if="isLoading" class="loader"></span>
      <span v-else>Ask</span>
    </button>
    <p v-if="response" class="ynab-assistant-response">{{ response }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { callOpenAI } from "@/api/openaiClient";
const userQuery = ref("");
const response = ref("");
const isLoading = ref(false);

async function handleQuery() {
  // Placeholder for OpenAI API call
  response.value = `Query: "${userQuery.value}" → (response goes here)`;
}

async function fetchResponse() {
  if (!userQuery.value.trim()) {
    response.value = "Please enter a query.";
    return;
  }

  isLoading.value = true;

  try {
    const openAIResponse = await callOpenAI(userQuery.value);
    response.value = openAIResponse;
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    response.value = "Error fetching response. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.ynab-assistant-container {
  padding: 1rem;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.ynab-assistant-header {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #007099; /* YNAB blue */
}

.ynab-assistant-textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.ynab-assistant-button {
  background-color: #007099; /* YNAB blue */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
}

.ynab-assistant-button:hover {
  background-color: #005a7a; /* Darker YNAB blue on hover */
}

.ynab-assistant-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loader {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.ynab-assistant-response {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e6f7ff; /* Light blue background for response */
  border: 1px solid #b3e0ff;
  border-radius: 4px;
}
</style>
