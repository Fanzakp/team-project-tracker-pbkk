// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    error: null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
  },

  actions: {
    async register(credentials) {
      try {
        const response = await fetch(
          'http://127.0.0.1:5000/api/auth/register',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.name, // Adjust to match backend field names
              email: credentials.email,
              password: credentials.password,
            }),
          },
        )

        const data = await response.json()

        if (response.ok) {
          this.token = data.accessToken
          // Decode token to get user info
          const payload = this.token.split('.')[1]
          this.user = JSON.parse(atob(payload))

          // Save to localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))

          return { success: true, message: data.message }
        }

        return {
          success: false,
          message: data.message || 'Registration failed',
        }
      } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Registration failed' }
      }
    },

    async login(credentials) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })

        if (response.ok) {
          const data = await response.json()
          this.token = data.accessToken // Using accessToken from response

          // Decode token to get user info
          const payload = this.token.split('.')[1]
          this.user = JSON.parse(atob(payload))

          // Optional: Save to localStorage
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
      // Remove from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // Method to initialize auth state from localStorage
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
