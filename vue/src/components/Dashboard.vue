<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const router = useRouter();

const projects = ref([]);
const tasks = ref([]);
const appointments = ref([]);
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

const fetchTasks = async () => {
  error.value = null;
  const token = localStorage.getItem('token');

  if (!token) {
    error.value = 'Not authenticated';
    router.push('/login');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/tasks', {
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
    console.log('Fetched tasks:', data); // Debug log
    tasks.value = data;
  } catch (err) {
    error.value = 'Error fetching tasks: ' + err.message;
    console.error('Error fetching tasks:', err);
  }
};

const filteredTasks = computed(() => {
  if (!selectedProject.value) return [];

  const statusMap = {
    1: 'Not Started',
    2: 'In Progress',
    3: 'Finished'
  };

  return tasks.value.filter(task =>
    task.status === statusMap[selectedProject.value.id]
  );
});

// Add function to handle project editing
const editProject = (projectId) => {
  router.push(`/edit-project/${projectId}`);
};

const editTask = (taskId) => {
  router.push(`/edit-task/${taskId}`);
};


onMounted(() => {
  if (selectedMenu.value === 'projects') {
    fetchProjects();
  }
  if (selectedMenu.value === 'status' && 'todaysTasks') {
    fetchTasks();
  }
  if (selectedMenu.value === 'calendar') {
    fetchProjects();
    fetchTasks();
  }
});

const status = ref([
  { id: 1, name: 'Not Started', description: 'Projects that has not been started yet', tasks: [

  ]},
  { id: 2, name: 'In Progress', description: 'In progress projects that needed updates', tasks: [

  ]},
  { id: 3, name: 'Finished', description: 'Finished projects will showed here', tasks: [

  ]},
]);

const selectedProjectId = ref(null);
const selectedProject = computed(() => status.value.find(project => project.id === selectedProjectId.value));

const selectedTasks = ref([]);
const selectedProjects = ref([]);

const toggleTaskSelection = (taskId) => {
  const index = selectedTasks.value.indexOf(taskId);
  if (index === -1) {
    selectedTasks.value.push(taskId);
  } else {
    selectedTasks.value.splice(index, 1);
  }
};

const toggleProjectSelection = (projectId) => {
  const index = selectedProjects.value.indexOf(projectId);
  if (index === -1) {
    selectedProjects.value.push(projectId);
  } else {
    selectedProjects.value.splice(index, 1);
  }
};

const deleteSelectedTasks = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedTasks.value.length} tasks?`)) return;

  try {
    const token = localStorage.getItem('token');
    for (const taskId of selectedTasks.value) {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    selectedTasks.value = [];
    await fetchTasks();
  } catch (err) {
    console.error('Error deleting tasks:', err);
    error.value = 'Failed to delete tasks';
  }
};

const deleteSelectedProjects = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedProjects.value.length} projects?`)) return;

  try {
    const token = localStorage.getItem('token');
    for (const projectId of selectedProjects.value) {
      await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    selectedProjects.value = [];
    await fetchProjects();
  } catch (err) {
    console.error('Error deleting projects:', err);
    error.value = 'Failed to delete projects';
  }
};

const isLoading = ref(false);

const selectProject = async (projectId) => {
  isLoading.value = true;
  try {
    selectedProjectId.value = projectId;
    await fetchProjects();
    await fetchTasks();
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    isLoading.value = false;
  }
};

const tasksWithProjectNames = computed(() => {
  console.log('Projects:', projects.value);
  console.log('Filtered Tasks:', filteredTasks.value);
  return filteredTasks.value.map(task => {
    const project = projects.value.find(p => p.id === task.projectId);
    console.log('Task:', task, 'Found Project:', project);
    return {
      ...task,
      projectName: project ? project.name : 'Unknown Project'
    };
  });
});

const addTask = () => {
  router.push('/new-task');
};

const addProject = () => {
  router.push('/new-project');
};

const todaysTasks = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.value
    .filter(task => {
      const taskDate = new Date(task.taskDue);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    })
    .map(task => {
      const project = projects.value.find(p => p.id === task.projectId);
      return {
        ...task,
        projectName: project ? project.name : 'Unknown Project'
      };
    });
});

const selectedMenu = ref('status');

// Update selectMenu to fetch projects when projects menu is selected
const selectMenu = (menu) => {
  selectedMenu.value = menu;
  if (menu === 'projects') {
    fetchProjects();
  } else if (menu === 'calendar') {
    fetchProjects();
    fetchTasks();
  }
};

const statusOptions = [
  'Not Started',
  'In Progress',
  'Finished'
];

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }

    // Refresh tasks after update
    await fetchTasks();
  } catch (err) {
    console.error('Error updating task status:', err);
    error.value = 'Failed to update task status';
  }
};

const calendarEvents = computed(() => {
  return tasks.value.map(task => ({
    start: new Date(task.taskDue),
    end: new Date(task.taskDue),
    title: task.name,
    content: `
      ${task.name}<br>
      Project: ${projects.value.find(p => p.id === task.projectId)?.name || 'Unknown'}
      <br>
      Status: <span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span>
      <br>
      Description: ${task.description}
    `,
    class: `status-${task.status.toLowerCase().replace(/\s+/g, '-')}`,
    cssClass: `task-event status-${task.status.toLowerCase().replace(/\s+/g, '-')}`,
  }));
});

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

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};
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
        <div class="header-actions">
          <h1>{{ selectedProject.name }}</h1>
          <button @click="addTask" class="btn-primary">Add New Task</button>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px">Select</th>
              <th>Name</th>
              <th>Project Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasksWithProjectNames" :key="task.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedTasks.includes(task.id)"
                  @change="toggleTaskSelection(task.id)"
                >
              </td>
              <td>{{ task.name }}</td>
              <td>{{ task.projectName }}</td>
              <td>{{ task.description }}</td>
              <td>
                <select
                  v-model="task.status"
                  @change="updateTaskStatus(task.id, task.status)"
                  class="status-select"
                >
                  <option
                    v-for="status in statusOptions"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>
              <td>{{ formatDate(task.taskDue) }}</td>
              <td>
                <button @click="editTask(task.id)" class="btn-edit">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          v-if="selectedTasks.length > 0"
          @click="deleteSelectedTasks"
          class="btn-delete">
          Delete
        </button>
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
              <th style="width: 30px">Select</th>
              <th>Name</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedProjects.includes(project.id)"
                  @change="toggleProjectSelection(project.id)"
                >
              </td>
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
        <button
          v-if="selectedProjects.length > 0"
          @click="deleteSelectedProjects"
          class="btn-delete">
          Delete
        </button>
      </div>
      <div v-if="selectedMenu === 'calendar'" class="calendar-section">
        <h2>Calendar</h2>
        <vue-cal
          :events="calendarEvents"
          :time="true"
          :disable-views="['years', 'year']"
          default-view="month"
          today-button
          :show-all-day-events="true"
          :time-from="0 * 60"
          :time-to="24 * 60"
          :time-step="60"
          style="height: 600px"
        >
          <template #event="{ event }">
            <div class="calendar-event">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-content" v-html="event.content"></div>
            </div>
          </template>
        </vue-cal>
      </div>
      <div v-if="selectedMenu === 'todaysTasks'" class="today-section">
        <h2>Today's Tasks</h2>
        <div v-if="todaysTasks.length === 0" class="no-tasks">
          No tasks due today
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Project</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in todaysTasks" :key="task.id">
              <td>{{ task.name }}</td>
              <td>{{ task.projectName }}</td>
              <td>{{ task.status }}</td>
              <td>{{ formatDate(task.taskDue) }}</td>
            </tr>
          </tbody>
        </table>
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
  overflow-x: auto; /* Allow horizontal scroll if table is too wide */
  padding: 2rem;
  margin-left: 250px;
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
  min-width: 900px; /* Set minimum width for the table */
}

table, th, td {
  border: 1px solid #ccc;
}

th, td {
  padding: 1rem;
  text-align: left;
  min-width: 120px; /* Set minimum width for columns */
}

th:nth-child(4),
td:nth-child(4) {
  min-width: 150px; /* Wider column for status dropdown */
}
th:nth-child(5),
td:nth-child(5) {
  min-width: 180px; /* Wider column for status dropdown */
}

/* Make description column flexible */
th:nth-child(3),
td:nth-child(3) {
  width: 15%; /* Description takes 30% of table width */
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

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #c82333;
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
  padding: 2rem;
  background: #333;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: white;
}

:deep(.vuecal__event) {
  border-radius: 4px;
  min-height: 35px; /* Reduced from 40px */
  min-width: 75px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  word-break: break-word;
  margin-top: -4px; /* Add negative margin to move up */
  position: relative; /* Add position relative */
}

:deep(.status-not-started) {
  background-color: rgba(220, 53, 69, 0.9) !important;
  color: white;
  border-left: 4px solid #dc3545;
}

:deep(.status-in-progress) {
  background-color: rgba(255, 193, 7, 0.9) !important;
  color: black;
  border-left: 4px solid #ffc107;
}

:deep(.status-finished) {
  background-color: rgba(40, 167, 69, 0.9) !important;
  color: white;
  border-left: 4px solid #28a745;
}

.status-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-badge.status-not-started {
  background-color: #dc3545;
  color: white;
}

.status-badge.status-in-progress {
  background-color: #ffc107;
  color: black;
}

.status-badge.status-finished {
  background-color: #28a745;
  color: white;
}

.calendar-event {
  height: 100%;
  padding-top: 9px; /* Add small top padding */
}

.event-title {
  font-weight: bold;
  font-size: clamp(0.7em, 1vw, 1.1em);
  margin-top: -2px; /* Add negative margin to move title up */
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

.event-content {
  font-size: clamp(0.5em, 0.8vw, 0.9em); /* Responsive font size */
  line-height: 1.4;
  padding: 0 4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
}

:deep(.vuecal__cell) {
  padding: 16px; /* Reduced from 20px */
}

:deep(.vuecal__cell-content) {
  padding: 8px; /* Reduced from 10px */
  height: calc(100% - 32px); /* Adjusted calculation */
}

:deep(.vuecal__title-bar) {
  background-color: #333;
  color: white;
}

:deep(.vuecal__menu) {
  background-color: #444;
}

:deep(.vuecal__view-btn) {
  color: white;
}

.today-section {
  margin-top: 2rem;
}

.status-select {
  width: 100%;
  min-width: 140px;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: white;
}

.status-select:focus {
  outline: none;
  border-color: #007BFF;
}

.btn-edit {
  background-color: #6c757d;
  color: white;
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
}

.btn-edit:hover {
  background-color: #5a6268;
}
</style>
