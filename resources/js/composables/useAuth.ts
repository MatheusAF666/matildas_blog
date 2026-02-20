import { ref, readonly } from 'vue'
import axios, { type AxiosError } from 'axios'

/**
 * Tipo para los datos del usuario autenticado
 */
type User = {
  id?: number | string
  name?: string
  email?: string
  [key: string]: unknown
}

/**
 * Tipo para la respuesta del servidor en operaciones de autenticación
 */
type AuthResponse = {
  status?: boolean
  user?: User
  message?: string
}

/**
 * Tipo para las credenciales de autenticación
 */
type AuthCredentials = {
  email: string
  password: string
  remember?: boolean
  name?: string
  password_confirmation?: string
  [key: string]: unknown
}

/**
 * Tipo para el resultado de operaciones de autenticación
 */
type AuthResult = {
  success: boolean
  message?: string
}

// Variables reactivas para gestionar el estado de autenticación
const user = ref<User | null>(null) // Usuario actualmente autenticado
const isAuthenticated = ref(false) // Indica si el usuario está autenticado
const loading = ref(false) // Indica si se está procesando una solicitud de autenticación

/**
 * Extrae el mensaje de error de una respuesta de Axios
 */
const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError.response?.data?.message ?? fallback
}

/**
 * Composable para gestionar la autenticación del usuario
 * Proporciona métodos para login, registro, logout y verificación de autenticación
 */
export function useAuth() {
  /**
   * Inicia sesión con el email y contraseña proporcionados
   */
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

  /**
   * Registra un nuevo usuario con los datos proporcionados
   */
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

  /**
   * Cierra la sesión del usuario actual
   */
  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (error: unknown) {
      console.error('Logout error:', error)
    }

    // Limpiar el estado de autenticación
    user.value = null
    isAuthenticated.value = false
  }

  /**
   * Verifica si el usuario actual tiene una sesión activa
   * Se ejecuta generalmente al cargar la aplicación
   */
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
      // Si hay error, el usuario no está autenticado
      user.value = null
      isAuthenticated.value = false
    }
  }

  // Retornar solo referencias readonly para evitar modificaciones externas
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