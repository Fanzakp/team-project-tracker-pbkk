import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import store from "../store";
import Home from "../components/Home.vue";
import Dashboard from "../components/Dashboard.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import Logout from "../components/Logout.vue";
import User from "../components/User.vue";
import About from "../components/About.vue";
import TaskForm from "@/components/TaskForm.vue";
import ProjectForm from "@/components/ProjectForm.vue";
import TaskEdit from "@/components/TaskEdit.vue";
import ProjectEdit from "@/components/ProjectEdit.vue";

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  },
  {
    path: "/user",
    component: User,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  },
  {
    path: "/logout",
    component: Logout,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  },
  {
    path: "/register",
    component: Register,
    meta: {
      requiresUnauth: true,
      hideSidebar: true
    }
  },
  {
    path: "/login",
    component: Login,
    meta: {
      requiresUnauth: true,
      hideSidebar: true
    }
  },
  {
    path: "/about",
    component: About,
    meta: {
      hideSidebar: true
    }
  },
  {
    path: "/new-task",
    component: TaskForm,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  },
  {
    path: "/new-project",
    component: ProjectForm,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  },
  {
    path: '/edit-task/:id',
    component: TaskEdit,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  },
  {
    path: '/edit-project/:id',
    component: ProjectEdit,
    meta: {
      requiresAuth: true,
      hideSidebar: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
