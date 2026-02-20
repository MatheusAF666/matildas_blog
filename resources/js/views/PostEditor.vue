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
              Volver
            </router-link>
            <h1 class="text-xl font-semibold">
              {{ isEditing ? 'Editar Post' : 'Nuevo Post' }}
            </h1>
          </div>
          <div class="flex items-center gap-3">
            <button 
              v-if="isEditing"
              @click="deletePost"
              :disabled="saving"
              class="rounded-lg border border-red-700 bg-red-900/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-900/60 transition-colors disabled:opacity-50"
            >
              Eliminar
            </button>
            <button 
              @click="savePost"
              :disabled="saving || !canSave"
              class="rounded-lg bg-amber-400/90 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Publicar') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Error Alert -->
        <div v-if="error" class="mb-6 rounded-lg border border-red-800/80 bg-red-900/40 p-4">
          <p class="text-red-300">{{ error }}</p>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-6 rounded-lg border border-green-800/80 bg-green-900/40 p-4">
          <p class="text-green-300">{{ successMessage }}</p>
        </div>

        <!-- Form -->
        <div class="space-y-8">
          <!-- Title -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Título <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.title"
              @input="generateSlug"
              type="text"
              placeholder="Escribe el título del post..."
              class="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              required
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Slug <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="url-amigable-del-post"
              class="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              required
            />
            <p class="mt-1 text-xs text-slate-400">URL: /article/{{ form.slug || 'slug' }}</p>
          </div>

          <!-- Content with Markdown Editor -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-semibold text-slate-300">
                Contenido (Markdown) <span class="text-red-400">*</span>
              </label>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="activeTab = 'editor'"
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-lg transition-colors',
                    activeTab === 'editor'
                      ? 'bg-amber-400/90 text-slate-950'
                      : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-amber-400/30'
                  ]"
                >
                  Editor
                </button>
                <button
                  type="button"
                  @click="activeTab = 'preview'"
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-lg transition-colors',
                    activeTab === 'preview'
                      ? 'bg-amber-400/90 text-slate-950'
                      : 'border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-amber-400/30'
                  ]"
                >
                  Preview
                </button>
              </div>
            </div>

            <!-- Markdown Toolbar -->
            <div
              v-if="activeTab === 'editor'"
              class="mb-3 flex flex-wrap gap-1 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
              @mousedown.prevent
            >
              <button
                type="button"
                @click="insertMarkdown('**', '**', 'Texto en negrita')"
                title="Negrita (Ctrl+B)"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                @click="insertMarkdown('*', '*', 'Texto en cursiva')"
                title="Cursiva (Ctrl+I)"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                @click="insertMarkdown('~~', '~~', 'Texto tachado')"
                title="Tachado"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <s>S</s>
              </button>

              <div class="w-px bg-slate-700"></div>

              <button
                type="button"
                @click="insertHeading(1)"
                title="Encabezado H1"
                class="rounded bg-slate-800/40 px-2 py-1 text-xs font-bold text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                H1
              </button>
              <button
                type="button"
                @click="insertHeading(2)"
                title="Encabezado H2"
                class="rounded bg-slate-800/40 px-2 py-1 text-xs font-bold text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                H2
              </button>
              <button
                type="button"
                @click="insertHeading(3)"
                title="Encabezado H3"
                class="rounded bg-slate-800/40 px-2 py-1 text-xs font-bold text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                H3
              </button>

              <div class="w-px bg-slate-700"></div>

              <button
                type="button"
                @click="insertList('bullet')"
                title="Lista con viñetas"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                @click="insertList('ordered')"
                title="Lista numerada"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>

              <div class="w-px bg-slate-700"></div>

              <button
                type="button"
                @click="insertMarkdown('> ', '', 'Cita o blockquote')"
                title="Cita"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L12.3 8m0 0l4.6-4.4a1 1 0 01.8 1.6l-4.6 4.6m0 0L3 20h10a3 3 0 003-3V6a1 1 0 00-1-1H3z" />
                </svg>
              </button>
              <button
                type="button"
                @click="insertMarkdown('`', '`', 'código')"
                title="Código inline"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors font-mono text-xs"
              >
                &lt;&gt;
              </button>
              <button
                type="button"
                @click="insertCodeBlock()"
                title="Bloque de código"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                </svg>
              </button>

              <div class="w-px bg-slate-700"></div>

              <button
                type="button"
                @click="insertLink()"
                title="Insertar enlace"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-.793.793-2.828-2.829.793-.793zM9.172 9.172a2 2 0 112.828 2.828L6.343 15.828a2 2 0 11-2.828-2.828l2.829-2.829zm9.02-7.02a3 3 0 10-4.243 4.243L11 7.586A1 1 0 109.586 9l2.829-2.829a3 3 0 000-4.243z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                @click="insertMarkdown('\n---\n', '', '')"
                title="Línea divisoria"
                class="rounded bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-700/60 hover:text-amber-300 transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- Editor Tab -->
            <div v-show="activeTab === 'editor'">
              <textarea
                ref="editorRef"
                v-model="form.content"
                @keydown="handleEditorKeydown"
                placeholder="Escribe el contenido en Markdown. Usa la barra de herramientas o atajos: Ctrl+B (negrita), Ctrl+I (cursiva), Ctrl+K (código), Ctrl+Shift+C (bloque de código)"
                class="min-h-96 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30 font-mono"
              ></textarea>
              <p class="mt-2 text-xs text-slate-400">
                {{ form.content.length }} caracteres |
                <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" class="text-amber-400 hover:underline">Ver guía de Markdown</a>
              </p>
            </div>

            <!-- Preview Tab -->
            <div 
              v-show="activeTab === 'preview'"
              class="min-h-[500px] rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-4 overflow-auto"
            >
              <div 
                v-if="form.content"
                class="prose prose-invert prose-slate prose-lg max-w-none"
                v-html="markdownPreview"
              ></div>
              <p v-else class="text-slate-500 text-center py-12">
                Escribe algo en el editor para ver el preview
              </p>
            </div>
          </div>

          <!-- Image -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Imagen Destacada
            </label>
            <div class="space-y-3">
              <!-- File input -->
              <div class="flex gap-3">
                <label class="flex-1 cursor-pointer">
                  <div class="flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/40 px-4 py-8 hover:border-amber-400/50 transition-colors">
                    <svg class="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div class="text-center">
                      <p class="text-sm font-semibold text-slate-300">
                        {{ selectedImageName || 'Seleccionar imagen' }}
                      </p>
                      <p class="text-xs text-slate-500 mt-1">PNG, JPG, GIF, WEBP hasta 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    @change="handleImageChange"
                    class="hidden"
                  />
                </label>
                <button
                  v-if="imagePreview || form.image_path"
                  @click="removeImage"
                  type="button"
                  class="rounded-lg border border-red-700 bg-red-900/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-900/60 transition-colors"
                >
                  Eliminar
                </button>
              </div>
              
              <!-- Image preview -->
              <div v-if="imagePreview || currentImageUrl" class="relative h-64 rounded-lg overflow-hidden border border-slate-700">
                <img 
                  :src="imagePreview || currentImageUrl" 
                  alt="Preview" 
                  class="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Categorías
            </label>
            <div class="space-y-2">
              <div v-if="loadingCategories" class="text-slate-400 text-sm">Cargando categorías...</div>
              <div v-else class="flex flex-wrap gap-2">
                <label 
                  v-for="category in categories" 
                  :key="category.id"
                  class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 cursor-pointer hover:border-amber-400/30 transition-colors"
                  :class="{ 'border-amber-400 bg-amber-400/10': isSelectedCategory(category.id) }"
                >
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="form.categories"
                    class="rounded border-slate-600 text-amber-400 focus:ring-amber-400/30"
                  />
                  <span class="text-sm text-slate-300">{{ category.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Meta Information -->
          <div class="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h3 class="text-lg font-semibold text-slate-200">SEO & Metadata</h3>
            
            <!-- Meta Title -->
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Meta Título
              </label>
              <input
                v-model="form.meta_title"
                type="text"
                placeholder="Título para SEO"
                maxlength="60"
                class="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <p class="mt-1 text-xs text-slate-400">{{ form.meta_title?.length || 0 }}/60 caracteres</p>
            </div>

            <!-- Meta Description -->
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Meta Descripción
              </label>
              <textarea
                v-model="form.meta_description"
                rows="3"
                placeholder="Descripción para motores de búsqueda"
                maxlength="160"
                class="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none"
              ></textarea>
              <p class="mt-1 text-xs text-slate-400">{{ form.meta_description?.length || 0 }}/160 caracteres</p>
            </div>
          </div>

          <!-- Published Date -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Fecha de Publicación
            </label>
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Fecha
                </label>
                <input
                  v-model="publishedDate"
                  type="date"
                  class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>
              <div>
                <label class="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Hora
                </label>
                <input
                  v-model="publishedTime"
                  type="time"
                  step="60"
                  class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 focus:border-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>
            </div>
            <p class="mt-1 text-xs text-slate-400">Deja en blanco para guardar como borrador</p>
          </div>

          <!-- User ID (Hidden, set automatically) -->
          <input type="hidden" v-model="form.user_id" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import axios from 'axios'
import { marked } from 'marked'

// Configurar marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, checkAuth } = useAuth()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')
const loadingCategories = ref(false)
const categories = ref<any[]>([])
const activeTab = ref<'editor' | 'preview'>('editor')
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const selectedImageName = ref('')
const currentImageUrl = ref('')
const publishedDate = ref('')
const publishedTime = ref('')

const form = ref({
  title: '',
  slug: '',
  content: '',
  image_path: '',
  meta_title: '',
  meta_description: '',
  published_at: '',
  user_id: user.value?.id || 1,
  categories: [] as number[]
})

const syncPublishedAt = () => {
  if (!publishedDate.value) {
    form.value.published_at = ''
    return
  }

  if (!publishedTime.value) {
    publishedTime.value = '09:00'
  }

  form.value.published_at = `${publishedDate.value}T${publishedTime.value}`
}

watch([publishedDate, publishedTime], syncPublishedAt)

const canSave = computed(() => {
  return form.value.title.trim() !== '' && 
         form.value.slug.trim() !== '' && 
         form.value.content.trim() !== ''
})

const markdownPreview = computed(() => {
  try {
    return marked.parse(form.value.content || '')
  } catch (e) {
    return '<p class="text-red-400">Error al procesar el markdown</p>'
  }
})

const generateSlug = () => {
  if (!isEditing.value || !form.value.slug) {
    form.value.slug = form.value.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    selectedImage.value = file
    selectedImageName.value = file.name
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  selectedImageName.value = ''
  currentImageUrl.value = ''
  form.value.image_path = ''
}

// Markdown editor toolbar functions
const editorRef = ref<HTMLTextAreaElement | null>(null)

const handleEditorKeydown = (event: KeyboardEvent) => {
  const isMod = event.ctrlKey || event.metaKey
  const key = event.key.toLowerCase()

  // Ctrl/Cmd+B - Bold
  if (isMod && key === 'b') {
    event.preventDefault()
    insertMarkdown('**', '**', 'Texto en negrita')
  }
  // Ctrl/Cmd+I - Italic
  else if (isMod && key === 'i') {
    event.preventDefault()
    insertMarkdown('*', '*', 'Texto en cursiva')
  }
  // Ctrl/Cmd+K - Code inline
  else if (isMod && key === 'k') {
    event.preventDefault()
    insertMarkdown('`', '`', 'código')
  }
  // Ctrl/Cmd+Shift+C - Code block
  else if (isMod && event.shiftKey && key === 'c') {
    event.preventDefault()
    insertCodeBlock()
  }
  // Tab - Insert 2 spaces instead of changing focus
  else if (event.key === 'Tab') {
    event.preventDefault()
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    form.value.content = 
      form.value.content.substring(0, start) + '  ' + form.value.content.substring(end)
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2
    })
  }
}

const insertMarkdown = (before: string, after: string, placeholder: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  const textToInsert = selectedText || placeholder

  form.value.content = 
    form.value.content.substring(0, start) +
    before + textToInsert + after +
    form.value.content.substring(end)

  // Move cursor position
  setTimeout(() => {
    textarea.focus()
    const newPosition = start + before.length + textToInsert.length
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

const insertHeading = (level: number) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const heading = '#'.repeat(level) + ' Encabezado ' + level

  form.value.content = 
    form.value.content.substring(0, start) + 
    (start > 0 && form.value.content[start - 1] !== '\n' ? '\n' : '') +
    heading + '\n' +
    form.value.content.substring(start)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + heading.length + 2, start + heading.length + 2)
  })
}

const insertList = (type: 'bullet' | 'ordered') => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const items = type === 'bullet' 
    ? '- Elemento 1\n- Elemento 2\n- Elemento 3'
    : '1. Elemento 1\n2. Elemento 2\n3. Elemento 3'

  form.value.content = 
    form.value.content.substring(0, start) + 
    (start > 0 && form.value.content[start - 1] !== '\n' ? '\n' : '') +
    items + '\n' +
    form.value.content.substring(start)

  setTimeout(() => {
    textarea.focus()
  })
}

const insertCodeBlock = () => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const codeBlock = '```javascript\n// Tu código aquí\nconstante = valor\n```'

  form.value.content = 
    form.value.content.substring(0, start) + 
    (start > 0 && form.value.content[start - 1] !== '\n' ? '\n' : '') +
    codeBlock + '\n' +
    form.value.content.substring(start)

  setTimeout(() => {
    textarea.focus()
  })
}

const insertLink = () => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const url = prompt('Ingresa la URL:')
  if (!url) return

  const selectedText = form.value.content.substring(start, end)
  const text = selectedText || 'Texto del enlace'

  form.value.content = 
    form.value.content.substring(0, start) +
    '[' + text + '](' + url + ')' +
    form.value.content.substring(end)

  setTimeout(() => {
    textarea.focus()
  })
}

const isSelectedCategory = (categoryId: number) => {
  return form.value.categories.includes(categoryId)
}

const loadCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await axios.get('/categories')
    categories.value = response.data
  } catch (err) {
    console.error('Error loading categories:', err)
  } finally {
    loadingCategories.value = false
  }
}

const loadPost = async () => {
  if (!isEditing.value) return
  
  try {
    const response = await axios.get(`/admin/posts/${route.params.id}`)
    const post = response.data
    
    console.log('Post cargado:', post)
    
    const isoDateTime = post.published_at
      ? new Date(post.published_at).toISOString().slice(0, 16)
      : ''

    const [datePart, timePart] = isoDateTime ? isoDateTime.split('T') : ['', '']
    publishedDate.value = datePart
    publishedTime.value = timePart

    form.value = {
      title: post.title,
      slug: post.slug,
      content: post.content,
      image_path: post.image_path || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      published_at: isoDateTime,
      user_id: post.user_id,
      categories: post.categories?.map((c: any) => c.id) || []
    }
    
    // Set current image URL if exists
    if (post.image_path) {
      currentImageUrl.value = `/storage/${post.image_path}`
    }
  } catch (err: any) {
    console.error('Error loading post:', err)
    console.error('Error response:', err.response?.data)
    console.error('Error status:', err.response?.status)
    console.error('Route params:', route.params.id)
    error.value = `Error al cargar el post: ${err.response?.data?.message || err.message || 'Error desconocido'}`
  }
}

const savePost = async () => {
  if (!canSave.value) return
  
  saving.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    // Crear FormData para enviar archivos
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('slug', form.value.slug)
    formData.append('content', form.value.content)
    formData.append('meta_title', form.value.meta_title || '')
    formData.append('meta_description', form.value.meta_description || '')
    formData.append('published_at', form.value.published_at || '')
    formData.append('user_id', form.value.user_id.toString())
    
    // Agregar categorías
    form.value.categories.forEach((categoryId) => {
      formData.append('categories[]', categoryId.toString())
    })
    
    // Agregar imagen si hay una nueva
    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }
    
    // Si se eliminó la imagen y no hay una nueva
    if (!selectedImage.value && !currentImageUrl.value && form.value.image_path === '') {
      formData.append('remove_image', 'true')
    }
    
    if (isEditing.value) {
      // Laravel no soporta multipart/form-data con PUT, usar POST con _method
      formData.append('_method', 'PUT')
      await axios.post(`/admin/posts/${route.params.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      successMessage.value = 'Post actualizado correctamente'
    } else {
      const response = await axios.post('/admin/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      successMessage.value = 'Post creado correctamente'
      
      // Redirigir al editor del nuevo post
      setTimeout(() => {
        router.push(`/admin/posts/${response.data.id}/edit`)
      }, 1500)
    }
  } catch (err: any) {
    console.error('Error saving post:', err)
    error.value = err.response?.data?.message || 'Error al guardar el post'
  } finally {
    saving.value = false
  }
}

const deletePost = async () => {
  if (!isEditing.value) return
  
  if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return
  
  try {
    await axios.delete(`/admin/posts/${route.params.id}`)
    successMessage.value = 'Post eliminado correctamente'
    setTimeout(() => {
      router.push('/admin')
    }, 1500)
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
  }
}

onMounted(async () => {
  // Verificar autenticación
  await checkAuth()
  
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  await loadCategories()
  await loadPost()
})
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: rgb(15 23 42);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: rgb(71 85 105);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgb(100 116 139);
}
</style>
