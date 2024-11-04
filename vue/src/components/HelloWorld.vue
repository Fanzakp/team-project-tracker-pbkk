<script setup>
import { ref, onMounted } from 'vue'
const message = ref('')
onMounted(async () => {
  const response = await fetch('/api/message')
  const data = await response.json()
  message.value = data.message
})
</script>
<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Welcome to the Team Project Tracker! This tool will help you manage and track your team's progress efficiently.
    </h3>
  </div>
</template>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}
h3 {
  font-size: 1.2rem;
}
.greetings h1,
.greetings h3 {
  text-align: center;
}
@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>