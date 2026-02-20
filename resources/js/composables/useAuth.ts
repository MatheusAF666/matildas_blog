import { ref, readonly } from 'vue'
import axios, { type AxiosError } from 'axios'

type User = {
  id?: number | string
  name?: string
  email?: string
  [key: string]: unknown
}

type AuthResponse = {
  status?: boolean
  user?: User
  message?: string
}

type AuthCredentials = {
  email: string
  password: string
  remember?: boolean
  name?: string
  password_confirmation?: string
  [key: string]: unknown
}

type AuthResult = {
  success: boolean
  message?: string
}

const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const loading = ref(false)

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? fallback
}

export function useAuth() {
  const login = async (credentials: AuthCredentials): Promise<AuthResult> => {
    loading.value = true
    try {
      const response = await axios.post<AuthResponse>('/login', credentials)

      if (response.data.status) {
        user.value = response.data.user ?? null
        isAuthenticated.value = true
        return { success: true }
      }

      return { success: false, message: response.data.message }
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Login failed'),
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: AuthCredentials): Promise<AuthResult> => {
    loading.value = true
    try {
      const response = await axios.post<AuthResponse>('/register', credentials)

      if (response.data.status) {
        user.value = response.data.user ?? null
        isAuthenticated.value = true
        return { success: true }
      }

      return { success: false, message: response.data.message }
    } catch (error: unknown) {
      return {
        success: false,
        message: getErrorMessage(error, 'Registration failed'),
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (error: unknown) {
      console.error('Logout error:', error)
    }

    user.value = null
    isAuthenticated.value = false
  }

  const checkAuth = async () => {
    try {
      const response = await axios.get<AuthResponse>('/user')
      if (response.data) {
        user.value = response.data
        isAuthenticated.value = true
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch (error: unknown) {
      user.value = null
      isAuthenticated.value = false
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    login,
    register,
    logout,
    checkAuth,
  }
}