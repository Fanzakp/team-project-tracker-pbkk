<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const error = ref('')

const projectData = ref({
  name: '',
  description: '',
  projectCreated: new Date().toISOString(),
  projectDue: '',
})

const submitproject = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}` // Add auth token
      },
      body: JSON.stringify({
        ...projectData.value,
      })
    })

    if (response.ok) {
      router.push('/dashboard')
    } else {
      const data = await response.json()
      error.value = data.message || 'Failed to create project'
    }
  } catch (err) {
    error.value = 'Error connecting to server'
    console.error('Error:', err)
  }
}
</script>

<template>
  <div class="project-form">
    <h2>Create New Project</h2>
    <form @submit.prevent="submitproject">
      <div class="form-group">
        <label for="name">Project Name</label>
        <input
          type="text"
          id="name"
          v-model="projectData.name"
          required
        >
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="projectData.description"
          rows="4"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="projectDue">Due Date</label>
        <input
          type="date"
          id="projectDue"
          v-model="projectData.projectDue"
        >
      </div>


      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="button-group">
        <button type="submit" class="btn-submit">Create project</button>
        <button type="button" class="btn-cancel" @click="router.back()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.project-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #333;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, textarea, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-submit {
  background-color: #007BFF;
  color: #333;
}

.btn-cancel {
  background-color: #6c757d;
  color: #333;
}

button:hover {
  opacity: 0.9;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: white;
}
</style>
