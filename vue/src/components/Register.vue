<template>
  <div class="register-container">
    <h1>Register</h1>
    <p>Create your account</p>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group" :class="{ error: !validations.username && username }">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required minlength="3" />
        <span v-if="!validations.username && username" class="error-text">
          Username must be at least 3 characters
        </span>
      </div>

      <div class="form-group" :class="{ error: !validations.email && email }">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
        <span v-if="!validations.email && email" class="error-text">
          Please enter a valid email address
        </span>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          minlength="6"
        />
      </div>
      <button type="submit" :disabled="isLoading || !isValid">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// Add more specific validation
const validations = computed(() => ({
  username: username.value.length >= 3,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
  password: password.value.length >= 6
}))

const isValid = computed(() =>
  Object.values(validations.value).every(valid => valid)
)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''

    // Validate before sending
    if (!validations.value.username) {
      error.value = 'Username must be at least 3 characters'
      return
    }
    if (!validations.value.email) {
      error.value = 'Please enter a valid email address'
      return
    }
    if (!validations.value.password) {
      error.value = 'Password must be at least 6 characters'
      return
    }

    const payload = {
      username: username.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value
    }

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to handle cookies
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (response.ok) {
      // Login after successful registration
      const loginSuccess = await authStore.login({
        email: email.value,
        password: password.value
      })

      if (loginSuccess) {
        router.push('/dashboard')
      } else {
        error.value = 'Registration successful but login failed'
      }
    } else {
      error.value = data.message || data.error || 'Registration failed'
      console.error('Registration error details:', data.error)
    }
  } catch (err) {
    error.value = 'Unable to connect to server'
    console.error('Registration error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

.register-container {
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
  margin-bottom: 1.5rem;
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
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
