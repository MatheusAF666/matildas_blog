<template>
  <div id="app">
        <nav class="relative border-b border-slate-800/80 bg-slate-950/80 text-slate-100 backdrop-blur">
      <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex h-16 items-center justify-between">
          <router-link
            to="/"
            class="text-lg sm:text-xl font-semibold tracking-wide text-slate-100 hover:text-amber-200 transition-colors"
          >
            <span class="hidden sm:inline">Matilda's Blog</span>
            <span class="sm:hidden">MB</span>
          </router-link>

          <div class="hidden md:flex items-center gap-4 text-sm">
            <template v-if="isAuthenticated">
              <router-link to="/admin" class="text-slate-200 hover:text-amber-200 transition-colors">
                Dashboard
              </router-link>
              <span class="text-slate-400 text-xs uppercase tracking-[0.2em]">Hola, {{ user?.name }}</span>
              <button
                @click="handleLogout"
                class="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 hover:border-red-400/60 hover:text-red-200 transition-colors"
              >
                Cerrar Sesion
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-slate-200 hover:text-amber-200 transition-colors">
                Iniciar Sesion
              </router-link>
              <router-link
                to="/register"
                class="rounded-xl bg-amber-400/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-300 transition-colors"
              >
                Registrarse
              </router-link>
            </template>
          </div>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-200 hover:text-amber-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-show="mobileMenuOpen" class="md:hidden border-t border-slate-800/80 py-4">
          <template v-if="isAuthenticated">
            <router-link
              to="/admin"
              class="block rounded-xl px-4 py-2 text-slate-200 hover:bg-slate-900/60 transition-colors"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>
            <div class="mt-2 border-t border-slate-800/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Hola, {{ user?.name }}
            </div>
            <button
              @click="handleLogout"
              class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 hover:border-red-400/60 hover:text-red-200 transition-colors"
            >
              Cerrar Sesion
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="block rounded-xl px-4 py-2 text-slate-200 hover:bg-slate-900/60 transition-colors"
              @click="mobileMenuOpen = false"
            >
              Iniciar Sesion
            </router-link>
            <router-link
              to="/register"
              class="mt-2 block rounded-xl bg-amber-400/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-300 transition-colors"
              @click="mobileMenuOpen = false"
            >
              Registrarse
            </router-link>
          </template>
        </div>
      </div>
    </nav>
    
    <main class="min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';

const router = useRouter();
const mobileMenuOpen = ref(false);


const { user, isAuthenticated, logout, checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})

const handleLogout = () => {
  logout()
  router.push('/login')
}

</script>