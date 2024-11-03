<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Email</label>
        <input
          type="text"
          id="email"
          v-model="email"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/dashboard')
  } else {
    // Handle login error
    console.error('Login failed')
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  font-size: 1.2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
