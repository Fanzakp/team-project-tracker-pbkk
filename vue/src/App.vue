<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header>
    <nav class="navbar">
      <router-link to="/dashboard">
        <img src="@/assets/notion-logo.png" alt="Logo" class="logo" />
      </router-link>
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/register">Register</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/logout">Logout</a></li>
        <li><a href="/user">User</a></li>
        <li><a href="/about">About</a></li>
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
