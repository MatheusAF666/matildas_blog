<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto"></div>
        <p class="text-slate-400 mt-4">Cargando artículo...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-6">
      <div class="max-w-md w-full rounded-2xl border border-red-800/80 bg-red-900/40 p-12 text-center">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <div class="flex gap-3 justify-center">
          <button 
            @click="loadArticle" 
            class="rounded-lg bg-amber-400/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            Reintentar
          </button>
          <router-link 
            to="/" 
            class="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition-colors"
          >
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="relative">
      <!-- Back Button -->
      <div class="fixed top-6 left-6 z-50">
        <router-link 
          to="/" 
          class="flex items-center gap-2 rounded-full bg-slate-900/90 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </router-link>
      </div>

      <!-- Hero Section with Image -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute -top-40 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
          <div class="absolute -bottom-20 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
        </div>

        <!-- Featured Image -->
        <div v-if="article.image" class="relative h-96 overflow-hidden">
          <img 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-full object-cover opacity-40"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        </div>

        <!-- Article Header -->
        <div class="relative px-6 py-12">
          <div class="mx-auto max-w-3xl">
            <!-- Category Badge -->
            <div class="flex items-center gap-3 mb-6">
              <span class="inline-block rounded-full bg-amber-400/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                {{ article.category }}
              </span>
              <span class="text-sm text-slate-400">{{ formatDate(article.publishedAt) }}</span>
            </div>

            <!-- Title -->
            <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              {{ article.title }}
            </h1>

            <!-- Excerpt -->
            <p class="text-xl text-slate-300 mb-8">
              {{ article.excerpt }}
            </p>

            <!-- Author Info -->
            <div class="flex items-center gap-4 pb-8 border-b border-slate-800">
              <img 
                :src="article.author.avatar" 
                :alt="article.author.name"
                class="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p class="text-lg font-semibold text-slate-100">{{ article.author.name }}</p>
                <p class="text-sm text-slate-400">{{ article.readTime }} min de lectura</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Article Body -->
      <section class="relative px-6 py-12">
        <div class="mx-auto max-w-3xl">
          <div class="prose prose-invert prose-slate prose-lg max-w-none">
            <div class="text-slate-300 leading-relaxed whitespace-pre-line" v-html="formattedContent"></div>
          </div>

          <!-- Categories -->
          <div v-if="article.categories && article.categories.length > 0" class="mt-12 pt-8 border-t border-slate-800">
            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Categorías</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="category in article.categories" 
                :key="category.id"
                class="inline-block rounded-full border border-slate-700 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-300"
              >
                {{ category.name }}
              </span>
            </div>
          </div>

          <!-- Share Section -->
          <div class="mt-12 pt-8 border-t border-slate-800">
            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Compartir</h3>
            <div class="flex gap-3">
              <button 
                @click="shareOnTwitter"
                class="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-amber-400/30 hover:text-amber-300 transition-colors"
              >
                Twitter
              </button>
              <button 
                @click="shareOnFacebook"
                class="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-amber-400/30 hover:text-amber-300 transition-colors"
              >
                Facebook
              </button>
              <button 
                @click="copyLink"
                class="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-amber-400/30 hover:text-amber-300 transition-colors"
              >
                {{ linkCopied ? '¡Copiado!' : 'Copiar enlace' }}
              </button>
            </div>
          </div>

          <!-- Back to Blog Button -->
          <div class="mt-12 text-center">
            <router-link 
              to="/" 
              class="inline-block rounded-lg bg-amber-400/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-300 transition-colors"
            >
              Ver más artículos
            </router-link>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
// Importaciones necesarias
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked'

// Configuración para el parser de markdown
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Obtener la ruta actual para extraer el slug del artículo
const route = useRoute()

// Variables reactivas para gestionar el estado del artículo
const article = ref<any>(null) // Datos del artículo cargado
const loading = ref(true) // Estado de carga del artículo
const error = ref('') // Mensaje de error si ocurre
const linkCopied = ref(false) // Estado del botón "Copiar enlace"

/**
 * Carga el artículo completo desde el API usando el slug de la URL
 * Mapea los datos de la base de datos al formato esperado por el template
 */
const loadArticle = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Obtener el slug de los parámetros de la ruta
    const slug = route.params.slug as string
    // Realizar petición GET al endpoint específico del post
    const response = await axios.get(`/posts/${slug}`)
    
    if (response.data) {
      // Mapear los datos del API al formato esperado
      article.value = {
        id: response.data.id,
        title: response.data.title,
        slug: response.data.slug,
        excerpt: response.data.meta_description || response.data.content?.substring(0, 200) + '...',
        content: response.data.content,
        category: response.data.categories?.[0]?.name || 'Sin categoría',
        categories: response.data.categories || [],
        image: response.data.image_path ? `/storage/${response.data.image_path}` : null,
        publishedAt: response.data.published_at,
        readTime: Math.ceil((response.data.content?.split(' ').length || 0) / 200),
        author: {
          name: response.data.user?.name || 'Anónimo',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.user?.name || 'default'}`,
        },
      }
    }
  } catch (err: any) {
    console.error('Error loading article:', err)
    // Manejar errores específicos
    if (err.response?.status === 404) {
      error.value = 'Artículo no encontrado'
    } else {
      error.value = err.response?.data?.message || 'Error al cargar el artículo. Por favor, intente de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Propiedad computada que convierte el contenido markdown a HTML
 */
const formattedContent = computed(() => {
  if (!article.value?.content) return ''
  
  try {
    // Parsear markdown a HTML usando la librería marked
    return marked.parse(article.value.content)
  } catch (e) {
    console.error('Error parsing markdown:', e)
    // Fallback: mostrar como texto plano con párrafos si el parser falla
    return article.value.content
      .split('\n\n')
      .map((paragraph: string) => `<p class="mb-6">${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }
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

/**
 * Abre una ventana emergente para compartir el artículo en Twitter
 */
const shareOnTwitter = () => {
  const url = window.location.href
  const text = article.value?.title || ''
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
}

/**
 * Abre una ventana emergente para compartir el artículo en Facebook
 */
const shareOnFacebook = () => {
  const url = window.location.href
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

/**
 * Copia el enlace actual del artículo al portapapeles
 * Muestra un mensaje de confirmación temporal
 */
const copyLink = async () => {
  try {
    // Copiar la URL actual al portapapeles
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    // Restaurar el mensaje después de 2 segundos
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error copying link:', err)
  }
}

// Cargar el artículo cuando el componente se monta
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.prose {
  color: #cbd5e1;
}

.prose p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.prose a {
  color: #fbbf24;
  text-decoration: underline;
}

.prose a:hover {
  color: #fcd34d;
}

.prose strong {
  color: #f1f5f9;
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  color: #f1f5f9;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose ul, .prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid #fbbf24;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #94a3b8;
}
</style>
