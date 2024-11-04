<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li @click="selectMenu('projects')">Projects
          <div v-if="selectedMenu === 'projects'" class="dropdown">
            <select v-model="selectedProjectId" @change="selectProject">
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
        </li>
        <li @click="selectMenu('calendar')">Calendar</li>
        <li @click="selectMenu('todaysTasks')">Today's Tasks</li>
      </ul>
    </aside>
    <main class="main-content">
      <div v-if="selectedMenu === 'projects' && selectedProject">
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
      <div v-if="selectedMenu === 'projects' && !selectedProject">
        <h1>{{ todayDate }}</h1>
        <p>Select a project from the dropdown to view details.</p>
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

<script setup>
import { ref, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const projects = ref([
  { id: 1, name: 'Not Started', description: 'Projects that has not been started yet', tasks: [
    { id: 1, title: 'Task 1', description: 'Description for Task 1' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2' },
  ]},
  { id: 2, name: 'In Progress', description: 'In progress project that needed updates', tasks: [
    { id: 3, title: 'Task 3', description: 'Description for Task 3' },
    { id: 4, title: 'Task 4', description: 'Description for Task 4' },
  ]},
  { id: 3, name: 'Finished', description: 'Finished projects will showed here', tasks: [
    { id: 5, title: 'Task 5', description: 'Description for Task 5' },
    { id: 6, title: 'Task 6', description: 'Description for Task 6' },
  ]},
]);

const selectedProjectId = ref(null);
const selectedProject = computed(() => projects.value.find(project => project.id === selectedProjectId.value));

const selectProject = () => {
  // No need to set selectedProject manually, computed property will handle it
};

const addTask = () => {
  if (selectedProject.value) {
    const newTaskId = selectedProject.value.tasks.length + 1;
    selectedProject.value.tasks.push({
      id: newTaskId,
      title: `Task ${newTaskId}`,
      description: `Description for Task ${newTaskId}`,
    });
  }
};

const appointments = ref([]);
const addAppointment = ({ start, end }) => {
  const title = prompt('Enter appointment title:');
  if (title) {
    appointments.value.push({ id: Date.now(), start, end, title });
  }
};

const todaysTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return selectedProject.value ? selectedProject.value.tasks.filter(task => task.date === today) : [];
});

const todaysAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return appointments.value.filter(appointment => appointment.start.split('T')[0] === today);
});

const selectedMenu = ref('projects');
const selectMenu = (menu) => {
  selectedMenu.value = menu;
};

const todayDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString(undefined, options);
});

</script>

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

.sidebar select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
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

.dropdown {
  margin-top: 0.5rem; /* Add margin to push other menu items down */
  z-index: 1000;
  width: 100%;
  padding: 0.5rem;
}
</style>
