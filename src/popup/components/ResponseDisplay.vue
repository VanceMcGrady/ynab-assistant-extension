<template>
  <div class="chat-history">
    <div v-for="(message, index) in messages" :key="index" class="message">
      <p class="message-content">{{ message.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  messages: {
    type: Array as () => Array<{ text: string; type: 'user' | 'bot' }>,
    required: true,
  },
});
</script>

<style scoped>
.chat-history {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
}

.message {
  margin-bottom: 1rem;
}

.message-content {
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #e6f7ff;
  border: 1px solid #b3e0ff;
}
</style>