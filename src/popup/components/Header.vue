<template>
  <div class="header-container">
    <h1 class="ynab-assistant-header">YNAB AI Assistant</h1>
    <button class="new-chat-button" @click="onNewChat">New Chat</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["newChat"]);

const onNewChat = () => {
  emit("newChat");
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ynab-assistant-header {
  font-size: 1.5rem;
  color: #007099; /* YNAB blue */
}

.new-chat-button {
  background-color: #007099;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.new-chat-button:hover {
  background-color: #005a7a;
}
</style>