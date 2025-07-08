<template>
  <div class="p-4 text-gray-800">
    <h1>YNAB AI Assistant</h1>
    <textarea v-model="userQuery" placeholder="Ask something..."></textarea>
    <button @click="handleQuery">Ask</button>
    <p v-if="response">{{ response }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const userQuery = ref("");
const response = ref("");

async function handleQuery() {
  // Placeholder for OpenAI API call
  response.value = `Query: "${userQuery.value}" → (response goes here)`;
}
</script>

<style scoped>
textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
}
</style>
