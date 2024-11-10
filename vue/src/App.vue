<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
</script>

<template>
  <header>
    <nav class="navbar">
      <router-link to="/dashboard" v-if="authStore.isAuthenticated">
        <img src="@/assets/notion-logo.png" alt="Logo" class="logo" />
      </router-link>
      <ul>
        <!-- Show these links only when authenticated -->
        <template v-if="authStore.isAuthenticated">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/user">User</router-link></li>
          <li><router-link to="/logout">Logout</router-link></li>
        </template>

        <!-- Show these links only when not authenticated -->
        <template v-else>
          <li><router-link to="/register">Register</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </template>

        <!-- Always show About -->
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </header>
  <div :class="{ 'no-margin': route.meta.noMargin }" id="app-container">
    <aside v-if="!route.meta.hideSidebar" class="sidebar">
      <!-- Sidebar content here -->
    </aside>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #111;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
  padding: 1.5rem 2rem;
}

.navbar ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0;
}

.navbar a {
  text-decoration: none;
  color: #fff; /* Change font color to white */
  font-weight: bold;
}

.navbar a:hover {
  background-color: #fff;
  color: #000;
}

#app-container {
  margin: 0;
  display: flex;
  margin-top: 3rem; /* Default margin for pages with sidebar */
}

.no-margin {
  margin: 0; /* Remove top margin for pages without sidebar */
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 3rem); /* Adjust this value if the navbar height changes */
  box-sizing: border-box;
  flex-direction: column; /* Ensure vertical alignment */
  font-size: 1.2rem; /* Increase font size for better readability */
  text-align: left; /* Center text for better readability */
  width: 100%; /* Ensure main content takes full width */
}

.sidebar {
  width: 250px;
  background-color: #111;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed; /* Fix the sidebar to the left side */
  top: 3rem; /* Position below the navbar */
  bottom: 0;
  left: 0;
  overflow-y: auto; /* Add scroll if content overflows */
}

@media (min-width: 1024px) {
  .navbar ul {
    justify-content: flex-start;
  }
}

img {
  width: 30px;
  height: 30px;
}

</style>
