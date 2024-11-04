import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const { token } = await response.json();
        commit("setToken", token);
        // Decode token to get user info (optional)
        const user = JSON.parse(atob(token.split(".")[1]));
        commit("setUser", user);
      }
    },
    async logout({ commit }) {
      commit("clearUser");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
