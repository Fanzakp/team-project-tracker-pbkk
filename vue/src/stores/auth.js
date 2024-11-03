// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })

        if (response.ok) {
          const data = await response.json()
          this.token = data.accessToken // Menggunakan accessToken dari response

          // Decode token untuk mendapatkan info user
          const payload = this.token.split('.')[1]
          this.user = JSON.parse(atob(payload))

          // Opsional: Simpan di localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))

          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      // Hapus dari localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // Method untuk menginisialisasi auth state dari localStorage
    initAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    },
  },
})
