// Importar estilos globales de la aplicación
import '../css/app.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { useAuth } from './composables/useAuth';

import App from './App.vue';

// ============================================
// Configuración de Axios
// ============================================

// Establecer la URL base para todas las solicitudes de axios
// Todas las peticiones se harán a /api/*
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; // Permitir envío de cookies con peticiones cross-origin
axios.defaults.headers.common['Accept'] = 'application/json';

/**
 * Obtiene el token CSRF del meta tag HTML
 * Laravel genera un token CSRF en el meta tag del HTML para proteger contra ataques CSRF
 */
const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : null;
};

// Obtener y establecer el token CSRF en los encabezados por defecto
const csrfToken = getCsrfToken();
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// ============================================
// Interceptores de Axios
// ============================================

/**
 * Interceptor de solicitud: Incluye el token CSRF en cada solicitud
 * Esto es necesario para que Laravel valide que la solicitud es legítima
 */
axios.interceptors.request.use(function (config) {
    const token = getCsrfToken();
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

/**
 * Interceptor de respuesta: Maneja errores de autenticación y tokens CSRF expirados
 */
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            // Token CSRF expirado: recargar la página para obtener un nuevo token
            console.error('CSRF token mismatch, reloading page...');
            window.location.reload();
        } else if (error.response?.status === 401) {
            // No autorizado: El usuario no está autenticado o su sesión expiró
            console.error('Unauthorized - authentication failed');
        }
        return Promise.reject(error);
    }
);

// ============================================
// Definición de Rutas
// ============================================

const routes = [
  // Ruta pública: Página de inicio con listado de artículos
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue')
  },
  // Ruta pública: Página de inicio de sesión
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/auth/Login.vue')
  },
  // Ruta pública: Página de registro de nuevos usuarios
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/auth/Register.vue')
  },
  // Ruta pública: Página de detalle de un artículo específico
  {
    path: '/article/:slug',
    name: 'article',
    component: () => import('./views/ArticleDetail.vue')
  },
  // Ruta protegida: Panel de administración del autor
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  // Ruta protegida: Crear nuevo artículo
  {
    path: '/admin/posts/create',
    name: 'posts.create',
    component: () => import('./views/PostEditor.vue'),
    meta: { requiresAuth: true }
  },
  // Ruta protegida: Editar artículo existente
  {
    path: '/admin/posts/:id/edit',
    name: 'posts.edit',
    component: () => import('./views/PostEditor.vue'),
    meta: { requiresAuth: true }
  },
];

// ============================================
// Configuración del Router
// ============================================

// Crear instancia del router con las rutas definidas
const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * Navigation Guard: Proteger rutas que requieren autenticación
 * Se ejecuta antes de cada cambio de ruta
 */
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Verificar con el backend si el usuario está autenticado
    await checkAuth();
    
    if (!isAuthenticated.value) {
      // Redirigir a la página de login si no está autenticado
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
  }
  
  // Permitir acceso a la ruta
  next();
});

// ============================================
// Creación e Inicialización de la Aplicación
// ============================================

// Crear la instancia principal de Vue
const app = createApp(App);

// Hacer axios disponible en todos los componentes como propiedad global $http
app.config.globalProperties.$http = axios;

// Instalar el router en la aplicación
app.use(router);

/**
 * Verificar autenticación al iniciar la aplicación
 * Antes de montar la aplicación, comprobamos si el usuario tiene una sesión activa
 */
const { checkAuth } = useAuth();
checkAuth().then(() => {
  // Montar la aplicación en el elemento con id="app" del HTML
  app.mount('#app');
});