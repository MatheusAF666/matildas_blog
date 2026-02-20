<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid opacity-40"></div>
    <div class="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl float-slow"></div>
    <div class="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl float-slower"></div>

    <div class="relative z-10">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <section class="space-y-6">
            <p class="text-xs uppercase tracking-[0.35em] text-amber-300/80">Matilda's Blog</p>
            <h1 class="font-display text-4xl sm:text-5xl font-semibold leading-tight">
              Vuelve a tu espacio creativo en minutos
            </h1>
            <p class="text-base text-slate-300 max-w-xl">
              Accede a tus borradores, estadisticas y nuevas ideas. Mantente al dia con tus
              publicaciones y con el ritmo de tu audiencia.
            </p>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <p class="text-xs text-slate-400">Actividad semanal</p>
                <p class="mt-2 text-2xl font-semibold text-slate-100">+18%</p>
                <p class="mt-1 text-xs text-slate-500">Lecturas y comentarios</p>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <p class="text-xs text-slate-400">Ideas guardadas</p>
                <p class="mt-2 text-2xl font-semibold text-slate-100">34</p>
                <p class="mt-1 text-xs text-slate-500">Listas para publicar</p>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Iniciar sesion</h2>
              <span class="text-[11px] uppercase tracking-[0.3em] text-emerald-300/80">Protegido</span>
            </div>
            <p class="mt-2 text-sm text-slate-400">
              Usa tus credenciales para continuar con tu panel.
            </p>

            <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
              <div>
                <label for="email" class="text-xs uppercase tracking-[0.2em] text-slate-400">Correo</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  placeholder="tu@email.com"
                  class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div>
                <label for="password" class="text-xs uppercase tracking-[0.2em] text-slate-400">Contrasena</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  placeholder="••••••••"
                  class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div v-if="errorMessage" class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {{ errorMessage }}
              </div>

              <div class="flex items-center justify-between text-sm text-slate-400">
                <label class="flex items-center gap-2">
                  <input
                    v-model="remember"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-400 focus:ring-amber-400/40"
                  />
                  Mantener sesion
                </label>
                <router-link to="/forgot-password" class="text-amber-300/80 hover:text-amber-200">
                  Olvidaste tu clave
                </router-link>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400/90 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2.8A5.2 5.2 0 006.8 12H4z"></path>
                </svg>
                <span>{{ loading ? 'Ingresando...' : 'Entrar al panel' }}</span>
              </button>

              <p class="text-center text-sm text-slate-400">
                No tienes cuenta?
                <router-link to="/register" class="text-cyan-300/80 hover:text-cyan-200">Crear cuenta</router-link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { login, loading } = useAuth()

const email = ref('')
const password = ref('')
const remember = ref(true)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''

  const result = await login({
    email: email.value,
    password: password.value,
    remember: remember.value,
  })

  if (result.success) {
    router.push('/')
    return
  }

  errorMessage.value = result.message ?? 'No se pudo iniciar sesion. Intenta de nuevo.'
}
</script>

<style scoped>
.bg-grid {
  background-image:
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
}

.float-slow {
  animation: float 12s ease-in-out infinite;
}

.float-slower {
  animation: float 16s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -18px, 0);
  }
}
</style>