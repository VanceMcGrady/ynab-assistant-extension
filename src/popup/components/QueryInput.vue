<template>
  <div>
    <textarea
      class="ynab-assistant-textarea"
      v-model="userQuery"
      placeholder="Ask something..."
      @keydown.enter.prevent="onEnter"
    ></textarea>
    <button
      class="ynab-assistant-button"
      @click="onAsk"
      :disabled="isLoading"
    >
      <span v-if="isLoading" class="loader"></span>
      <span v-else>Ask</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// This component is responsible for handling user input and emitting an 'ask' event.
// It now accepts an `isLoading` prop to control the display of a loader, 
// centralizing state management in the parent component.
import { ref } from "vue";

defineProps<{
  isLoading: boolean;
}>();

const userQuery = ref("");

const emit = defineEmits(["ask"]);

const onAsk = () => {
  emit("ask", userQuery.value);
  userQuery.value = "";
};

const onEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) {
    return;
  }
  onAsk();
};
</script>

<style scoped>
.ynab-assistant-textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.ynab-assistant-button {
  background-color: #007099;
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
  background-color: #005a7a;
}

.ynab-assistant-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
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
</style>