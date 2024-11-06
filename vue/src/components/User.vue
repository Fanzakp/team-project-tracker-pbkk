<script setup>
import { ref } from 'vue';

const user = ref({
  name: 'admin',
  email: 'admin@example.com',
  password: 'admin123',
  team: {
    status: 'Active',
    members: [
      { name: 'Alice', role: 'Developer' },
      { name: 'Bob', role: 'Designer' },
      { name: 'Charlie', role: 'Project Manager' }
    ]
  }
});

const isEditing = ref(false);

const updateUser = () => {
  // Handle the update logic here
  console.log('User updated:', user.value);
  isEditing.value = false;
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5">
        <div class="user-container">
          <h1 class="text-center">User Details</h1>
          <div v-if="!isEditing">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <button @click="isEditing = true" class="btn btn-primary">Edit</button>
          </div>

          <form v-else @submit.prevent="updateUser">
            <div class="form-group">
              <label for="name">Name:</label>
              <input
                type="text"
                id="name"
                v-model="user.name"
                required
                minlength="3"
                maxlength="30"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                v-model="user.email"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input
                type="password"
                id="password"
                v-model="user.password"
                required
                minlength="6"
                class="form-control"
              />
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
            <button @click="isEditing = false" type="button" class="btn btn-secondary">Cancel</button>
          </form>
        </div>
      </div>

      <div class="col-md-7">
        <div class="team-container">
          <h2 class="text-center">Team Status</h2>
          <p><strong>Status:</strong> {{ user.team.status }}</p>
          <h3>Members</h3>
          <ul class="list-group">
            <li v-for="member in user.team.members" :key="member.name" class="list-group-item">
              <strong>{{ member.name }}</strong> {{ member.role }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-container {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.team-container {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  font-size: 1.2rem;
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
  margin-top: 0.5rem;
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

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
