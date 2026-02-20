import '../css/app.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { useAuth } from './composables/useAuth';

import App from './App.vue';

// setea la URL base para todas las solicitudes de axios
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

// Función para obtener el token CSRF del meta tag
const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : null;
};

//  Configura el token CSRF en los encabezados de axios
const csrfToken = getCsrfToken();
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// adiciona un interceptor de solicitud para incluir el token CSRF en cada solicitud
axios.interceptors.request.use(function (config) {
    const token = getCsrfToken();
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// adiciona un interceptor de respuesta para manejar errores de token CSRF y autenticación
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            // CSRF token mismatch - reload the page to get a fresh token
            console.error('CSRF token mismatch, reloading page...');
            window.location.reload();
        } else if (error.response?.status === 401) {
            // Unauthorized - clear auth state, don't redirect automatically
            // The navigation guard will handle redirecting to login
            console.error('Unauthorized - authentication failed');
        }
        return Promise.reject(error);
    }
);

// Define routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/auth/Register.vue')
  },
  {
    path: '/article/:slug',
    name: 'article',
    component: () => import('./views/ArticleDetail.vue')
  },
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/posts/create',
    name: 'posts.create',
    component: () => import('./views/PostEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/posts/:id/edit',
    name: 'posts.edit',
    component: () => import('./views/PostEditor.vue'),
    meta: { requiresAuth: true }
  },/*
  {
    path: '/dashboard',
    name: 'dashboard', 
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('./views/clients/Index.vue')
  },
  {
    path: '/clients/create',
    name: 'clients.create',
    component: () => import('./views/clients/Create.vue')
  },
  {
    path: '/clients/:id/edit',
    name: 'clients.edit',
    component: () => import('./views/clients/Edit.vue')
  },
  {
    path: '/clients/:id',
    name: 'clients.show',
    component: () => import('./views/clients/Show.vue')
  },
  {
    path: '/budgets',
    name: 'budgets',
    component: () => import('./views/budgets/Index.vue')
  },
  {
    path: '/budgets/create',
    name: 'budgets.create',
    component: () => import('./views/budgets/Create.vue')
  },
  {
    path: '/budgets/:id/edit',
    name: 'budgets.edit',
    component: () => import('./views/budgets/Edit.vue')
  },
  {
    path: '/budgets/:id',
    name: 'budgets.show',
    component: () => import('./views/budgets/Show.vue')
  }*/
];

// crea el router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard para rutas protegidas
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  
  if (to.meta.requiresAuth) {
    // Verificar autenticación con el backend antes de permitir acceso
    await checkAuth();
    
    if (!isAuthenticated.value) {
      // Redirigir a login si no está autenticado
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
  }
  
  next();
});

// crea la aplicación Vue
const app = createApp(App);

// hace que axios esté disponible globalmente como $http
app.config.globalProperties.$http = axios;

// usa el router
app.use(router);

// Verificar autenticación al iniciar la aplicación
const { checkAuth } = useAuth();
checkAuth().then(() => {
  // monta la aplicación
  app.mount('#app');
});