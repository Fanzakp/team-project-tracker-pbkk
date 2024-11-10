<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const router = useRouter();

const projects = ref([]);
const error = ref(null);

const fetchProjects = async () => {
  error.value = null;
  const token = localStorage.getItem('token');

  if (!token) {
    error.value = 'Not authenticated';
    router.push('/login');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    projects.value = data;
  } catch (err) {
    error.value = 'Error fetching projects: ' + err.message;
    console.error('Error fetching projects:', err);

    // Handle unauthorized access
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
};

// Add function to handle project editing
const editProject = (projectId) => {
  router.push(`/edit-project/${projectId}`);
};

onMounted(() => {
  if (selectedMenu.value === 'projects') {
    fetchProjects();
  }
});

const status = ref([
  { id: 1, name: 'Not Started', description: 'status that has not been started yet', tasks: [

  ]},
  { id: 2, name: 'In Progress', description: 'In progress project that needed updates', tasks: [

  ]},
  { id: 3, name: 'Finished', description: 'Finished status will showed here', tasks: [

  ]},
]);

const selectedProjectId = ref(null);
const selectedProject = computed(() => status.value.find(project => project.id === selectedProjectId.value));

const selectProject = (projectId) => {
  selectedProjectId.value = projectId;
};

const addTask = () => {
  router.push('/new-task');
};

const todaysTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return selectedProject.value ? selectedProject.value.tasks.filter(task => task.date === today) : [];
});

const selectedMenu = ref('status');

// Update selectMenu to fetch projects when projects menu is selected
const selectMenu = (menu) => {
  selectedMenu.value = menu;
  if (menu === 'projects') {
    fetchProjects();
  }
};

const dropdowns = ref({
  status: false,
});

const toggleDropdown = (menu) => {
  dropdowns.value[menu] = !dropdowns.value[menu];
  if (menu === 'status') {
    selectedMenu.value = 'status';
  }
};

const todayDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString(undefined, options);
});
</script>

<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li @click="toggleDropdown('status')" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" aria-expanded="false">
            Status
          </a>
          <ul v-if="dropdowns.status" class="dropdown-menu">
            <li v-for="project in status" :key="project.id">
              <a class="dropdown-item" href="#" @click="selectProject(project.id)">
                {{ project.name }}
              </a>
            </li>
          </ul>
        </li>
        <li @click="selectMenu('projects')">Projects</li>
        <li @click="selectMenu('calendar')">Calendar</li>
        <li @click="selectMenu('todaysTasks')">Today's Tasks</li>
      </ul>
    </aside>
    <main class="main-content">
      <div v-if="selectedMenu === 'status' && selectedProject">
        <h1>{{ selectedProject.name }}</h1>
        <p>{{ selectedProject.description }}</p>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in selectedProject.tasks" :key="task.id">
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="addTask">Add New Task</button>
      </div>
      <div v-if="selectedMenu === 'status' && !selectedProject">
        <h1>{{ todayDate }}</h1>
        <p>Select a project from the dropdown to view details.</p>
      </div>
      <div v-if="selectedMenu === 'projects'" class="projects-section">
        <div class="header-actions">
          <h2>Projects</h2>
          <button @click="addProject" class="btn-primary">Add New Project</button>
        </div>

        <table class="projects-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td>{{ project.name }}</td>
              <td>{{ project.description }}</td>
              <td>{{ new Date(project.projectDue).toLocaleDateString() }}</td>
              <td>
                <button @click="editProject(project.id)" class="btn-secondary">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="selectedMenu === 'calendar'" class="calendar-section">
        <h2>Calendar</h2>
        <vue-cal
          v-model="appointments"
          @cell-click="addAppointment"
          :time="true"
          :on-event-click="editAppointment"
          :on-event-dblclick="deleteAppointment"
          default-view="week"
        ></vue-cal>
      </div>
      <div v-if="selectedMenu === 'todaysTasks'" class="today-section">
        <h2>Today's Tasks</h2>
        <ul>
          <li v-for="task in todaysTasks" :key="task.id">{{ task.title }}</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  height: calc(100vh - 3rem); /* Adjust height to account for navbar */
  margin-top: 3rem; /* Add top margin to account for navbar */
}

.sidebar {
  width: 250px;
  background-color: #111;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed; /* Fix the sidebar to the left side */
  top: 4rem; /* Position below the navbar */
  bottom: 0;
  left: 0;
  overflow-y: auto; /* Add scroll if content overflows */
}

.sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative; /* Add relative positioning for dropdown */
}

.sidebar li:hover {
  background-color: #e0e0e0;
  color: #333;
}

.sidebar .dropdown-menu {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  padding: 0.5rem 0;
  margin: 0;
  list-style: none;
}

.sidebar .dropdown-item {
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  display: block;
}

.sidebar .dropdown-item:hover {
  background-color: #e0e0e0;
  color: #333;
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-left: 250px; /* Add left margin to account for sidebar width */
}

.main-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.main-content p {
  font-size: 1.2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

table, th, td {
  border: 1px solid #ccc;
}

th, td {
  padding: 0.5rem;
  text-align: left;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.projects-section {
  padding: 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  color: white;
}

.projects-table th,
.projects-table td {
  padding: 1rem;
  text-align: left;
}

.projects-table th {
  background-color: #222;
  font-weight: bold;
}

.btn-primary {
  background-color: #007BFF;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.9;
}

button:hover {
  background-color: #0056b3;
}

.calendar-section {
  margin-top: 1rem;
}

::v-deep .vuecal__cell {
  padding: 27px;
}

.today-section {
  margin-top: 2rem;
}
</style>
