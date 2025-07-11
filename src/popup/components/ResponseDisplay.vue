<template>
  <div class="chat-history" ref="chatHistoryContainer">
    <div v-for="(message, index) in messages" :key="index" class="message">
      <p class="message-content">{{ message.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, nextTick } from "vue";

const props = defineProps({
  messages: {
    type: Array as () => Array<{ text: string; type: 'user' | 'bot' }>,
    required: true,
  },
});

const chatHistoryContainer = ref<HTMLElement | null>(null);

watch(
  () => props.messages,
  async () => {
    await nextTick();
    if (chatHistoryContainer.value) {
      chatHistoryContainer.value.scrollTop =
        chatHistoryContainer.value.scrollHeight;
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chat-history {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
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