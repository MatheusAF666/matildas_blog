<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid opacity-40"></div>
    <div class="absolute -top-28 right-8 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl float-slow"></div>
    <div class="absolute bottom-0 -left-16 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl float-slower"></div>

    <div class="relative z-10">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <section class="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl backdrop-blur order-2 lg:order-1">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Crear cuenta</h2>
              <span class="text-[11px] uppercase tracking-[0.3em] text-emerald-300/80">Nuevo</span>
            </div>
            <p class="mt-2 text-sm text-slate-400">
              Empieza a publicar y organizar tus ideas.
            </p>

            <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
              <div>
                <label for="name" class="text-xs uppercase tracking-[0.2em] text-slate-400">Nombre</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  autocomplete="name"
                  required
                  placeholder="Tu nombre"
                  class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div>
                <label for="email" class="text-xs uppercase tracking-[0.2em] text-slate-400">Correo</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  placeholder="tu@email.com"
                  class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label for="password" class="text-xs uppercase tracking-[0.2em] text-slate-400">Contrasena</label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    autocomplete="new-password"
                    required
                    placeholder="••••••••"
                    class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-300/70 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30"
                  />
                </div>
                <div>
                  <label for="password_confirmation" class="text-xs uppercase tracking-[0.2em] text-slate-400">Confirmar</label>
                  <input
                    id="password_confirmation"
                    v-model="passwordConfirmation"
                    type="password"
                    autocomplete="new-password"
                    required
                    placeholder="••••••••"
                    class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-300/70 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30"
                  />
                </div>
              </div>

              <div v-if="errorMessage" class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400/90 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2.8A5.2 5.2 0 006.8 12H4z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}</span>
              </button>

              <p class="text-center text-sm text-slate-400">
                Ya tienes cuenta?
                <router-link to="/login" class="text-emerald-300/80 hover:text-emerald-200">Iniciar sesion</router-link>
              </p>
            </form>
          </section>

          <section class="space-y-6 order-1 lg:order-2">
            <p class="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Matildas Blog</p>
            <h1 class="font-display text-4xl sm:text-5xl font-semibold leading-tight">
              Haz crecer tu comunidad con cada historia
            </h1>
            <p class="text-base text-slate-300 max-w-xl">
              Publica, administra y mide tu impacto. Todo desde un panel simple y potente.
            </p>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <p class="text-xs text-slate-400">Editorial</p>
                <p class="mt-2 text-2xl font-semibold text-slate-100">3 flujos</p>
                <p class="mt-1 text-xs text-slate-500">Ideas, borradores, publicados</p>
              </div>
              <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <p class="text-xs text-slate-400">Lectores</p>
                <p class="mt-2 text-2xl font-semibold text-slate-100">+2.4k</p>
                <p class="mt-1 text-xs text-slate-500">Suscriptores activos</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

const extractMessage = (error: unknown) => {
  const maybeError = error as {
    response?: { data?: { message?: string; errors?: Record<string, string[]> } };
  };

  if (maybeError.response?.data?.message) {
    return maybeError.response.data.message;
  }

  const errors = maybeError.response?.data?.errors;
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0];
    if (firstKey && Array.isArray(errors[firstKey]) && errors[firstKey][0]) {
      return errors[firstKey][0];
    }
  }

  return 'No se pudo crear la cuenta. Intenta de nuevo.';
};

const handleSubmit = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    await axios.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    router.push('/login');
  } catch (error) {
    errorMessage.value = extractMessage(error);
  } finally {
    isSubmitting.value = false;
  }
};
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