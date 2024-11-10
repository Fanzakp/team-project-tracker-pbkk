<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const error = ref(null)
const isLoading = ref(true)

const projectData = ref({
  name: '',
  description: '',
  projectCreated: '',
  projectDue: ''
})

const fetchProject = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:5000/api/projects/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Failed to fetch project')

    const data = await response.json()
    // Format dates for input fields
    data.projectDue = new Date(data.projectDue).toISOString().split('T')[0]
    projectData.value = data
  } catch (err) {
    error.value = 'Error fetching project: ' + err.message
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProject()
})

const updateProject = async () => {
  try {
    if (!projectData.value.name) {
      error.value = 'Project name is required'
      return
    }

    const response = await fetch(`http://localhost:5000/api/projects/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        name: projectData.value.name,
        description: projectData.value.description,
        projectDue: projectData.value.projectDue ? new Date(projectData.value.projectDue).toISOString() : null
      })
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update project')
    }

    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Error connecting to server'
    console.error('Error:', err)
  }
}
</script>

<template>
  <div class="project-form">
    <h2>Edit Project</h2>
    <div v-if="isLoading" class="loading">Loading...</div>
    <form v-else @submit.prevent="updateProject">
      <div class="form-group">
        <label for="name">Project Name *</label>
        <input
          type="text"
          id="name"
          v-model="projectData.name"
          required
          minlength="1"
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
        <button type="submit" class="btn-submit">Update Project</button>
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

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  color: #333;
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
  color: #fff;
}

.btn-cancel {
  background-color: #6c757d;
  color: #fff;
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

.loading {
  text-align: center;
  padding: 2rem;
  color: #fff;
}
</style>
