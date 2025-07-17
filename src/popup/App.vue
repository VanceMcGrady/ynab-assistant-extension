<template>
  <div class="ynab-assistant-container">
    <Header />
    <ResponseDisplay :messages="chatHistory" />
    <QueryInput @ask="handleAsk" :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
// This is the main component for the popup.
// It has been refactored to use the `useChat` composable, which centralizes chat state and logic.
// This approach simplifies the component's responsibilities to primarily rendering UI elements.
import Header from "./components/Header.vue";
import QueryInput from "./components/QueryInput.vue";
import ResponseDisplay from "./components/ResponseDisplay.vue";
import { useChat } from "./composables/useChat";

const { chatHistory, isLoading, handleAsk } = useChat();
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
