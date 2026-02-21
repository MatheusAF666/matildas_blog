<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <!-- Admin Floating Button -->
    <div v-if="isAuthenticated" class="fixed bottom-6 right-6 z-50">
      <router-link 
        to="/admin"
        class="flex items-center gap-2 rounded-full bg-amber-400/90 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:bg-amber-300 transition-all hover:scale-105"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Dashboard
      </router-link>
    </div>

    <!-- Hero Section -->
    <section class="relative overflow-hidden px-6 py-16 sm:py-24">
      <div class="absolute inset-0">
        <div class="absolute -top-40 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
        <div class="absolute -bottom-20 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-6">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">Matilda's Blog</p>
          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Historias que transforman
            <span class="block bg-gradient-to-r from-amber-200 via-amber-300 to-cyan-200 bg-clip-text text-transparent">
              la forma de pensar
            </span>
          </h1>

          <p class="max-w-2xl text-base text-slate-300">
            Descubre artículos profundos sobre crecimiento personal, tecnología y emprendimiento.
          </p>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="relative w-full max-w-md">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar artículos..."
                class="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              class="rounded-2xl bg-amber-400/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950 transition hover:bg-amber-300"
              @click.prevent
            >
              Explorar
            </button>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Tarjeta de información del blog -->
          <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Sobre el blog</p>
            <p class="mt-3 text-xl font-semibold text-slate-100">Matilda's Blog</p>
            <p class="mt-1 text-xs text-slate-500">Artículos sobre crecimiento personal y tecnología</p>
          </div>
          <!-- Tarjeta de llamado a la acción -->
          <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Únete</p>
            <p class="mt-3 text-lg font-semibold text-slate-100">Comparte tus historias</p>
            <p class="mt-1 text-xs text-slate-500">Crea tu propia cuenta y publica artículos</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Section -->
    <section class="relative px-6 py-16 sm:py-20">
      <div class="mx-auto max-w-5xl">
        <!-- Filters -->
        <div class="mb-12 flex flex-wrap gap-2">
          <button
            @click="selectedCategory = null"
            :class="[
              'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
              selectedCategory === null
                ? 'bg-amber-400/90 text-slate-950'
                : 'border border-slate-700 bg-slate-900/40 text-slate-200 hover:border-amber-400/30'
            ]"
          >
            Todos
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
              selectedCategory === cat
                ? 'bg-amber-400/90 text-slate-950'
                : 'border border-slate-700 bg-slate-900/40 text-slate-200 hover:border-amber-400/30'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p class="text-slate-400 mt-4">Cargando artículos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-2xl border border-red-800/80 bg-red-900/40 p-12 text-center">
          <p class="text-red-400">{{ error }}</p>
          <button 
            @click="loadArticles" 
            class="mt-4 rounded-lg bg-amber-400/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- Articles Grid -->
        <div v-else-if="filteredArticles.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="group rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden backdrop-blur hover:border-amber-400/30 transition-all"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden bg-slate-800">
              <img
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div v-else class="h-full w-full bg-gradient-to-br from-amber-400/10 to-cyan-400/10 flex items-center justify-center">
                <svg class="h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex flex-wrap items-center gap-3">
                <span class="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                  {{ article.category }}
                </span>
                <span class="text-xs text-slate-400">{{ formatDate(article.publishedAt) }}</span>
              </div>

              <h3 class="mt-4 text-lg font-semibold leading-tight text-slate-100 group-hover:text-amber-300 transition-colors">
                {{ article.title }}
              </h3>

              <p class="mt-3 line-clamp-2 text-sm text-slate-400" v-html="renderExcerpt(article.excerpt)"></p>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img
                    :src="article.author.avatar"
                    :alt="article.author.name"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-xs font-semibold text-slate-200">{{ article.author.name }}</p>
                    <p class="text-xs text-slate-500">{{ article.readTime }} min de lectura</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex items-center gap-2">
                <router-link
                  :to="`/article/${article.slug}`"
                  class="flex-1 inline-block rounded-lg bg-amber-400/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 hover:bg-amber-400/30 transition-colors text-center"
                >
                  Leer más
                </router-link>
                <router-link
                  v-if="isAuthenticated"
                  :to="`/admin/posts/${article.id}/edit`"
                  class="rounded-lg border border-slate-700 bg-slate-900/40 p-2 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                  title="Editar post"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <!-- No articles -->
        <div v-else class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center">
          <p class="text-slate-400">No se encontraron artículos.</p>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="relative px-6 py-16 sm:py-20">
      <div class="mx-auto max-w-2xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 sm:p-12 backdrop-blur">
        <h2 class="font-display text-2xl sm:text-3xl font-semibold">Suscríbete al boletín</h2>
        <p class="mt-2 text-slate-300">Recibe los mejores artículos directamente en tu correo.</p>

        <form class="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="tu@email.com"
            class="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
          />
          <button
            type="submit"
            class="rounded-xl bg-amber-400/90 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Importaciones necesarias de Vue y composables
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { renderMarkdownInline } from '../lib/markdown'
import axios from 'axios'

// Obtener estado de autenticación del usuario
const { isAuthenticated } = useAuth()

// Variables reactivas para gestionar el estado de la página
const searchQuery = ref('') // Término de búsqueda ingresado por el usuario
const selectedCategory = ref<string | null>(null) // Categoría seleccionada para filtrar
const articles = ref<any[]>([]) // Lista de artículos cargados desde el API
const categories = ref<string[]>([]) // Lista de categorías disponibles
const loading = ref(true) // Indica si los artículos se están cargando
const error = ref('') // Guarda mensajes de error si ocurren

const renderExcerpt = (excerpt: string) => renderMarkdownInline(excerpt)

/**
 * Carga la lista de artículos desde el API
 * Mapea los datos de la base de datos al formato esperado por el template
 */
const loadArticles = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Realizar petición GET al endpoint de posts
    const response = await axios.get('/posts')
    
    if (response.data) {
      // Mapear los datos del API al formato esperado por el template
      articles.value = response.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.meta_description || extractExcerpt(post.content),
        content: post.content,
        category: post.categories?.[0]?.name || 'Sin categoría',
        categories: post.categories || [],
        image: post.image_path ? `/storage/${post.image_path}` : null,
        publishedAt: post.published_at,
        readTime: Math.ceil((post.content?.split(' ').length || 0) / 200), // ~200 palabras/min
        author: {
          name: post.user?.name || 'Anónimo',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.name || 'default'}`,
        },
      }))
    }
  } catch (err: any) {
    console.error('Error loading articles:', err)
    error.value = err.response?.data?.message || 'Error al cargar los artículos. Por favor, intente de nuevo.'
  } finally {
    loading.value = false
  }
}

const extractExcerpt = (content: string) => {
  if (!content) return ''
  const paragraph = content.split(/\n\s*\n/)[0]
  return paragraph?.trim() || ''
}

/**
 * Carga la lista de categorías disponibles desde el API
 */
const loadCategories = async () => {
  try {
    const response = await axios.get('/categories')
    if (response.data) {
      categories.value = response.data.map((cat: any) => cat.name)
    }
  } catch (err) {
    console.error('Error loading categories:', err)
    // Si no se pueden cargar categorías, usar valores por defecto
    categories.value = ['Tecnología', 'Emprendimiento', 'Crecimiento', 'Historias']
  }
}

/**
 * Propiedad computada que filtra los artículos según búsqueda y categoría seleccionada
 */
const filteredArticles = computed(() => {
  return articles.value.filter((article: any) => {
    // Filtrar por término de búsqueda en título o extracto
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Filtrar por categoría seleccionada (si hay alguna)
    const matchesCategory = selectedCategory.value === null || 
      article.categories.some((category: any) => category.name === selectedCategory.value)

    return matchesSearch && matchesCategory
  })
})

/**
 * Formatea una fecha al formato español (ej: "25 de febrero de 2026")
 */
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Cargar artículos y categorías al montar el componente
onMounted(() => {
  loadArticles()
  loadCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>