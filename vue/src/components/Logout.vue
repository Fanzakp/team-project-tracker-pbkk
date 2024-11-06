<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isConfirmed = ref(false);

const logout = () => {
  if (isConfirmed.value) {
    // Remove authentication (e.g., clear token or user data)
    localStorage.removeItem('authToken'); // Example of clearing a token
    router.push('/login'); // Redirect to login page
  }
};
</script>

<template>
  <div class="logout-container">
    <h1>Log Out</h1>
    <p>Are you sure you want to log out?</p>
    <div class="d-flex justify-content-center">
      <button @click="isConfirmed = true; logout()" class="btn btn-danger me-2">Yes, log out</button>
      <button @click="router.push('/')" class="btn btn-secondary">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.logout-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.75rem 1.5rem;
}
</style>
