<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const projects = ref([]);
const error = ref(null);

const fetchProjects = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    error.value = 'Not authenticated';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    projects.value = data;
  } catch (err) {
    error.value = 'Error fetching projects: ' + err.message;
    console.error('Error:', err);
  }
};

onMounted(() => {
  fetchProjects();
});

const taskData = ref({
  name: '', // Changed from title to match backend
  description: '',
  status: '', // Added default status
  taskDue: '',
  projectId: '', // Added project selection
})

const submitTask = async () => {
  try {
    // Debug log
    console.log('Submitting task data:', {
      ...taskData.value,
      taskDue: new Date(taskData.value.taskDue).toISOString()
    });

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        ...taskData.value,
        taskDue: new Date(taskData.value.taskDue).toISOString()
      })
    })

    // Debug log response
    const responseData = await response.json()
    console.log('Server response:', responseData)

    if (response.ok) {
      router.push('/dashboard')
    } else {
      error.value = responseData.message || 'Failed to create task'
    }
  } catch (err) {
    error.value = 'Error connecting to server'
    console.error('Error:', err)
  }
}
</script>

<template>
  <div class="task-form">
    <h2>Create New Task</h2>
    <form @submit.prevent="submitTask">
      <div class="form-group">
        <label for="name">Task Name</label>
        <input
          type="text"
          id="name"
          v-model="taskData.name"
          required
        >
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="taskData.description"
          rows="4"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="projectId">Project</label>
        <select
          id="projectId"
          v-model="taskData.projectId"
          required
        >
          <option value="">Select Project</option>
          <option
            v-for="project in projects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="status">Status</label>
        <select
          id="status"
          v-model="taskData.status"
          required>
          <option value="">Select Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Finished">Finished</option>
        </select>
      </div>
      <div class="form-group">
        <label for="taskDue">Due Date</label>
        <input
          type="date"
          id="taskDue"
          v-model="taskData.taskDue"
        >
      </div>


      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="button-group">
        <button type="submit" class="btn-submit">Create Task</button>
        <button type="button" class="btn-cancel" @click="router.back()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.task-form {
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
