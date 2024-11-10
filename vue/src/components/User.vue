<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = ref(null);
const isEditing = ref(false);
const isLoading = ref(true);
const error = ref('');

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/profile`, {
      method: 'GET', // Explicitly specify GET method
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      user.value = {
        name: data.username,
        email: data.email,
        isAdmin: data.isAdmin
      };
    } else {
      error.value = 'Failed to load user data';
    }
  } catch (err) {
    error.value = 'Error loading user data';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

// Update the updateUser function
const updateUser = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${user.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        username: user.value.name,
        email: user.value.email,
        password: user.value.password
      })
    });

    if (response.ok) {
      isEditing.value = false;
    } else {
      error.value = 'Failed to update user data';
    }
  } catch (err) {
    error.value = 'Error updating user data';
    console.error(err);
  }
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5">
        <div class="user-container">
          <h1 class="text-center">User Details</h1>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-if="isLoading" class="text-center">
            Loading...
          </div>

          <template v-else-if="user">
            <div v-if="!isEditing">
              <p><strong>Username:</strong> {{ user.name }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>isAdmin:</strong> {{ user. isAdmin}}</p>
              <button @click="isEditing = true" class="btn btn-primary">Edit</button>
            </div>

            <form v-else @submit.prevent="updateUser">
              <div class="form-group">
                <label for="name">Username:</label>
                <input
                  type="text"
                  id="name"
                  v-model="user.username"
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
