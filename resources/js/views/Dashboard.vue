<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link 
              to="/" 
              class="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Blog
            </router-link>
            <h1 class="text-xl font-semibold">Panel de Administración</h1>
          </div>
          <router-link 
            to="/admin/posts/create"
            class="flex items-center gap-2 rounded-lg bg-amber-400/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Post
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Total Posts</p>
                <p class="text-3xl font-semibold text-slate-100">{{ posts.length }}</p>
              </div>
              <div class="rounded-full bg-amber-400/20 p-3">
                <svg class="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Publicados</p>
                <p class="text-3xl font-semibold text-green-400">{{ publishedCount }}</p>
              </div>
              <div class="rounded-full bg-green-400/20 p-3">
                <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Borradores</p>
                <p class="text-3xl font-semibold text-slate-400">{{ draftCount }}</p>
              </div>
              <div class="rounded-full bg-slate-400/20 p-3">
                <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar posts..."
              class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            />
            <svg class="absolute right-3 top-2.5 h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="flex gap-2">
            <button
              @click="filterStatus = 'all'"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                filterStatus === 'all'
                  ? 'bg-amber-400/90 text-slate-950'
                  : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-amber-400/30'
              ]"
            >
              Todos
            </button>
            <button
              @click="filterStatus = 'published'"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                filterStatus === 'published'
                  ? 'bg-amber-400/90 text-slate-950'
                  : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-amber-400/30'
              ]"
            >
              Publicados
            </button>
            <button
              @click="filterStatus = 'draft'"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                filterStatus === 'draft'
                  ? 'bg-amber-400/90 text-slate-950'
                  : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-amber-400/30'
              ]"
            >
              Borradores
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p class="text-slate-400 mt-4">Cargando posts...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-2xl border border-red-800/80 bg-red-900/40 p-12 text-center">
          <p class="text-red-400">{{ error }}</p>
          <button 
            @click="loadPosts" 
            class="mt-4 rounded-lg bg-amber-400/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- Posts List -->
        <div v-else-if="filteredPosts.length > 0" class="space-y-4">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="group rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-all hover:border-amber-400/30"
          >
            <div class="p-6">
              <div class="flex items-start gap-4">
                <!-- Image -->
                <div v-if="post.image_path" class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-800">
                  <img :src="`/storage/${post.image_path}`" :alt="post.title" class="w-full h-full object-cover" />
                </div>
                <div v-else class="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-amber-400/10 to-cyan-400/10 flex items-center justify-center">
                  <svg class="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {{ post.title }}
                      </h3>
                      <p class="mt-1 text-sm text-slate-400 line-clamp-2">
                        {{ post.meta_description || post.content?.substring(0, 150) + '...' }}
                      </p>
                    </div>

                    <!-- Status Badge -->
                    <span 
                      :class="[
                        'flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                        post.published_at 
                          ? 'bg-green-400/20 text-green-300' 
                          : 'bg-slate-400/20 text-slate-400'
                      ]"
                    >
                      {{ post.published_at ? 'Publicado' : 'Borrador' }}
                    </span>
                  </div>

                  <div class="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>{{ formatDate(post.created_at) }}</span>
                    <span>•</span>
                    <span>{{ post.user?.name || 'Anónimo' }}</span>
                    <span v-if="post.categories?.length">•</span>
                    <span v-if="post.categories?.length">
                      {{ post.categories.map((c: any) => c.name).join(', ') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-4 flex items-center gap-2 pt-4 border-t border-slate-800">
                <router-link
                  :to="`/article/${post.slug}`"
                  target="_blank"
                  class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-amber-400/30 hover:text-amber-300 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver
                </router-link>

                <router-link
                  :to="`/admin/posts/${post.id}/edit`"
                  class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-amber-400/30 hover:text-amber-300 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </router-link>

                <button
                  @click="confirmDelete(post)"
                  class="flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/60 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <svg class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-slate-400 mb-4">No se encontraron posts</p>
          <router-link 
            to="/admin/posts/create"
            class="inline-block rounded-lg bg-amber-400/90 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            Crear primer post
          </router-link>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="postToDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
      @click.self="postToDelete = null"
    >
      <div class="mx-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 class="text-lg font-semibold text-slate-100 mb-2">¿Eliminar post?</h3>
        <p class="text-slate-400 mb-6">
          ¿Estás seguro de que quieres eliminar "{{ postToDelete.title }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="postToDelete = null"
            class="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="deletePost"
            :disabled="deleting"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import axios from 'axios'

const router = useRouter()
const { isAuthenticated, checkAuth } = useAuth()

const posts = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filterStatus = ref<'all' | 'published' | 'draft'>('all')
const postToDelete = ref<any>(null)
const deleting = ref(false)

const publishedCount = computed(() => {
  return posts.value.filter(p => p.published_at).length
})

const draftCount = computed(() => {
  return posts.value.filter(p => !p.published_at).length
})

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    // Filter by search query
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Filter by status
    const matchesStatus = 
      filterStatus.value === 'all' ||
      (filterStatus.value === 'published' && post.published_at) ||
      (filterStatus.value === 'draft' && !post.published_at)

    return matchesSearch && matchesStatus
  })
})

const loadPosts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get('/admin/posts')
    posts.value = response.data
  } catch (err: any) {
    console.error('Error loading posts:', err)
    error.value = err.response?.data?.message || 'Error al cargar los posts'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const confirmDelete = (post: any) => {
  postToDelete.value = post
}

const deletePost = async () => {
  if (!postToDelete.value) return
  
  deleting.value = true
  
  try {
    await axios.delete(`/admin/posts/${postToDelete.value.id}`)
    
    // Remove from list
    posts.value = posts.value.filter(p => p.id !== postToDelete.value.id)
    
    postToDelete.value = null
  } catch (err: any) {
    console.error('Error deleting post:', err)
    if (err.response?.status === 401) {
      error.value = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      error.value = err.response?.data?.message || 'Error al eliminar el post'
    }
    postToDelete.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  // Verificar autenticación
  await checkAuth()
  
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  await loadPosts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
