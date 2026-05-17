<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import StatBadge from '@/components/molecules/StatBadge.vue'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'
import RoadmapCard from '@/components/molecules/RoadmapCard.vue'
import LandingPage from '@/pages/LandingPage.vue'
import { roadmapInterpretacaoTextos } from '@/data/roadmaps/interpretacao-textos'

const router = useRouter()
const authStore = useAuthStore()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()
const progressStore = useProgressStore()
const settingsStore = useSettingsStore()

const showAddRoadmapModal = ref(false)
const newRoadmapTitle = ref('')
const newRoadmapDescription = ref('')
const newRoadmapCategory = ref('')
const newRoadmapTags = ref('')
const newRoadmapVisibility = ref<'public' | 'private'>('private')
const editingRoadmapId = ref<string | null>(null)
const showImportModal = ref(false)
const importData = ref('')
const showGlobalSearch = ref(false)
const globalSearchQuery = ref('')
const globalSearchResults = ref<any[]>([])

// Filter state
const filterName = ref('')
const filterStatus = ref<'all' | 'ativo' | 'pausado' | 'concluido'>('all')

dailyLogStore.initLogs()

const roadmapIds = ref<string[]>([])

// Computed property for filtered roadmaps
const filteredRoadmapIds = computed(() => {
  let roadmaps = Object.keys(roadmapStore.roadmaps)
  
  // Filter by name
  if (filterName.value.trim()) {
    const searchTerm = filterName.value.toLowerCase().trim()
    roadmaps = roadmaps.filter(id => {
      const roadmap = roadmapStore.roadmaps[id]
      return roadmap.title.toLowerCase().includes(searchTerm) || 
             roadmap.description.toLowerCase().includes(searchTerm)
    })
  }
  
  // Filter by status
  if (filterStatus.value !== 'all') {
    roadmaps = roadmaps.filter(id => {
      const roadmap = roadmapStore.roadmaps[id]
      return (roadmap.status || 'ativo') === filterStatus.value
    })
  }
  
  return roadmaps.sort((a, b) => {
    const roadmapA = roadmapStore.roadmaps[a]
    const roadmapB = roadmapStore.roadmaps[b]
    return (roadmapA.order || 0) - (roadmapB.order || 0)
  })
})

function initRoadmapOrder() {
  roadmapIds.value = Object.keys(roadmapStore.roadmaps).sort((a, b) => {
    const roadmapA = roadmapStore.roadmaps[a]
    const roadmapB = roadmapStore.roadmaps[b]
    return (roadmapA.order || 0) - (roadmapB.order || 0)
  })
}

function navigateToRoadmap(roadmapId: string) {
  roadmapStore.setActiveRoadmap(roadmapId)
  router.push({
    name: 'roadmap',
    params: { roadmapId }
  })
}

function createNewRoadmap() {
  if (!newRoadmapTitle.value.trim()) {
    alert('Digite um título para o roadmap')
    return
  }

  const tags = newRoadmapTags.value.trim()
    ? newRoadmapTags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    : []

  const id = roadmapStore.addRoadmap(
    newRoadmapTitle.value.trim(),
    newRoadmapDescription.value.trim(),
    newRoadmapCategory.value.trim() || '',
    tags,
    newRoadmapVisibility.value
  )
  if (!id) {
    alert('Sem login, você pode criar até 7 roadmaps. Faça login para liberar mais.')
    return
  }
  newRoadmapTitle.value = ''
  newRoadmapDescription.value = ''
  newRoadmapCategory.value = ''
  newRoadmapTags.value = ''
  newRoadmapVisibility.value = 'private'
  showAddRoadmapModal.value = false
  navigateToRoadmap(id)
}

function useExampleRoadmap() {
  // Copiar o roadmap de exemplo
  const id = roadmapStore.addRoadmap(
    roadmapInterpretacaoTextos.title,
    roadmapInterpretacaoTextos.description,
    'exemplo',
    ['concursos', 'português'],
    'private'
  )

  if (!id) {
    alert('Sem login, você pode criar até 7 roadmaps. Faça login para liberar mais.')
    return
  }

  // Copiar blocos e tópicos
  const newRoadmap = roadmapStore.roadmaps[id]
  if (newRoadmap && roadmapInterpretacaoTextos.blocks) {
    newRoadmap.blocks = JSON.parse(JSON.stringify(roadmapInterpretacaoTextos.blocks))
    roadmapStore.roadmaps[id] = newRoadmap
  }

  navigateToRoadmap(id)
}

function getRoadmapStats(roadmapId: string) {
  const roadmap = roadmapStore.roadmaps[roadmapId]
  if (!roadmap) return { blocks: 0, topics: 0, resources: 0, percent: 0 }

  let totalTopics = 0
  let completedTopics = 0
  let totalResources = 0

  roadmap.blocks.forEach(block => {
    totalTopics += block.topics.length
    completedTopics += block.topics.filter(t => t.status === 'concluido').length
    block.topics.forEach(topic => {
      totalResources += topic.resources.length
    })
  })

  return {
    blocks: roadmap.blocks.length,
    topics: totalTopics,
    resources: totalResources,
    percent: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
  }
}

function handleRoadmapEdit(roadmapId: string) {
  editingRoadmapId.value = roadmapId
}

function handleRoadmapDelete(roadmapId: string, password?: string) {
  if (!password) {
    return
  }

  if (password !== settingsStore.settings.deletePassword) {
    alert('Senha incorreta!')
    return
  }

  roadmapStore.removeRoadmap(roadmapId)
  initRoadmapOrder()
}

function handleRoadmapMoveUp(roadmapId: string) {
  roadmapStore.moveRoadmapUp(roadmapId)
  initRoadmapOrder()
}

function handleRoadmapMoveDown(roadmapId: string) {
  roadmapStore.moveRoadmapDown(roadmapId)
  initRoadmapOrder()
}

function handleRoadmapUpdateColor(roadmapId: string, color: string) {
  roadmapStore.updateRoadmapColor(roadmapId, color as any)
}

function handleRoadmapUpdate(
  roadmapId: string,
  updates: { title: string; description: string; rating: number; status: string }
) {
  roadmapStore.updateRoadmap(roadmapId, updates.title, updates.description, updates.rating, updates.status as any)
}

function handleRoadmapMarkComplete(roadmapId: string) {
  const roadmap = roadmapStore.roadmaps[roadmapId]
  if (roadmap) {
    // Mark all topics in all blocks as completed
    roadmap.blocks.forEach(block => {
      block.topics.forEach(topic => {
        topic.status = 'concluido'
      })
    })
    roadmap.updatedAt = new Date().toISOString()
    // Update roadmap status to completed
    roadmapStore.updateRoadmap(roadmapId, roadmap.title, roadmap.description, roadmap.rating, 'concluido')
  }
}

function handleRoadmapMarkIncomplete(roadmapId: string) {
  const roadmap = roadmapStore.roadmaps[roadmapId]
  if (roadmap) {
    // Mark all topics in all blocks as not started
    roadmap.blocks.forEach(block => {
      block.topics.forEach(topic => {
        topic.status = 'nao_iniciado'
      })
    })
    roadmap.updatedAt = new Date().toISOString()
    // Update roadmap status to active
    roadmapStore.updateRoadmap(roadmapId, roadmap.title, roadmap.description, roadmap.rating, 'ativo')
  }
}

function handleExportRoadmap(roadmapId: string) {
  const exportData = roadmapStore.exportRoadmap(roadmapId)
  if (exportData) {
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const roadmap = roadmapStore.roadmaps[roadmapId]
    a.download = `${roadmap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

function handleImportRoadmap() {
  if (!importData.value.trim()) {
    alert('Cole os dados do roadmap para importar')
    return
  }

  const id = roadmapStore.importRoadmap(importData.value)
  if (id) {
    importData.value = ''
    showImportModal.value = false
    navigateToRoadmap(id)
  } else {
    alert('Erro ao importar roadmap. Verifique os dados e tente novamente.')
  }
}

function handleFileImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    importData.value = content
  }
  reader.onerror = () => {
    alert('Erro ao ler o arquivo. Tente novamente.')
  }
  reader.readAsText(file)
}

function performGlobalSearch() {
  if (!globalSearchQuery.value.trim()) {
    globalSearchResults.value = []
    return
  }

  const query = globalSearchQuery.value.toLowerCase().trim()
  const results: any[] = []

  // Buscar em todos os roadmaps
  Object.values(roadmapStore.roadmaps).forEach(roadmap => {
    // Buscar no título e descrição do roadmap
    if (roadmap.title.toLowerCase().includes(query) || 
        roadmap.description.toLowerCase().includes(query)) {
      results.push({
        type: 'roadmap',
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        roadmapTitle: roadmap.title,
        category: roadmap.category,
        tags: roadmap.tags
      })
    }

    // Buscar nos blocos
    roadmap.blocks.forEach(block => {
      if (block.title.toLowerCase().includes(query)) {
        results.push({
          type: 'block',
          id: block.id,
          title: block.title,
          description: '',
          roadmapTitle: roadmap.title,
          roadmapId: roadmap.id,
          category: roadmap.category,
          tags: roadmap.tags
        })
      }

      // Buscar nos tópicos
      block.topics.forEach(topic => {
        if (topic.title.toLowerCase().includes(query) || 
            (topic.description && topic.description.toLowerCase().includes(query))) {
          results.push({
            type: 'topic',
            id: topic.id,
            title: topic.title,
            description: topic.description || '',
            roadmapTitle: roadmap.title,
            roadmapId: roadmap.id,
            blockId: block.id,
            blockTitle: block.title,
            category: roadmap.category,
            tags: roadmap.tags
          })
        }

        // Buscar nos recursos
        topic.resources.forEach(resource => {
          if (resource.title.toLowerCase().includes(query) || 
              resource.url.toLowerCase().includes(query)) {
            results.push({
              type: 'resource',
              id: resource.id,
              title: resource.title,
              description: resource.url,
              roadmapTitle: roadmap.title,
              roadmapId: roadmap.id,
              blockId: block.id,
              blockTitle: block.title,
              topicId: topic.id,
              topicTitle: topic.title,
              category: roadmap.category,
              tags: roadmap.tags
            })
          }
        })
      })
    })
  })

  globalSearchResults.value = results
}

function navigateToSearchResult(result: any) {
  switch (result.type) {
    case 'roadmap':
      navigateToRoadmap(result.id)
      break
    case 'block':
    case 'topic':
    case 'resource':
      navigateToRoadmap(result.roadmapId)
      break
  }
  showGlobalSearch.value = false
  globalSearchQuery.value = ''
  globalSearchResults.value = []
}
</script>

<template>
  <LandingPage v-if="!authStore.isLoggedIn" />

  <div v-else class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-6xl mx-auto p-4 space-y-8">
      <!-- Header -->
      <div class="text-center py-8">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Meus Roadmaps
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Crie e acompanhe múltiplos roadmaps de estudo
        </p>
        <AppButton
          variant="secondary"
          size="md"
          @click="showGlobalSearch = true"
          class="flex items-center gap-2"
        >
          <AppIcon name="search" size="sm" />
          Busca Global
        </AppButton>
      </div>

      <!-- Filters and Create Button -->
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-initial">
            <input
              v-model="filterName"
              type="text"
              placeholder="Buscar roadmaps..."
              class="w-full sm:w-64 px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <AppIcon name="search" size="sm" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            v-model="filterStatus"
            class="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
          >
            <option value="all">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="pausado">Pausados</option>
            <option value="concluido">Concluídos</option>
          </select>
        </div>
        
        <!-- Import and Create Buttons -->
        <div class="flex items-center gap-3">
          <AppButton
            variant="primary"
            size="md"
            @click="showAddRoadmapModal = true"
            class="flex items-center gap-2 flex-shrink-0"
          >
            <AppIcon name="plus" size="sm" />
            Novo Roadmap
          </AppButton>
          <AppButton
            variant="ghost"
            size="sm"
            @click="showImportModal = true"
            class="flex items-center gap-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Importar um roadmap"
          >
            <AppIcon name="upload" size="sm" />
            <span class="hidden sm:inline">Importar</span>
          </AppButton>
        </div>
      </div>

      <!-- Example Roadmaps Section -->
      <div v-if="filteredRoadmapIds.length === 0" class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Roadmaps de Exemplo</h2>
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ roadmapInterpretacaoTextos.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ roadmapInterpretacaoTextos.description }}
              </p>
              <div class="flex gap-2 pt-2">
                <span class="text-xs bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                  {{ roadmapInterpretacaoTextos.blocks?.length || 0 }} módulos
                </span>
                <span class="text-xs bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-1 rounded">
                  Concursos
                </span>
              </div>
            </div>
            <AppButton
              variant="primary"
              size="sm"
              @click="useExampleRoadmap()"
              class="flex-shrink-0"
            >
              Usar como Template
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Results count -->
      <div v-if="filterName || filterStatus !== 'all'" class="text-sm text-gray-600 dark:text-gray-400">
        {{ filteredRoadmapIds.length }} {{ filteredRoadmapIds.length === 1 ? 'roadmap encontrado' : 'roadmaps encontrados' }}
      </div>

      <!-- Roadmaps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RoadmapCard
          v-for="(id, idx) in filteredRoadmapIds"
          :key="id"
          :roadmap="roadmapStore.roadmaps[id]"
          :roadmap-id="id"
          :stats="getRoadmapStats(id)"
          :can-move-up="idx > 0"
          :can-move-down="idx < filteredRoadmapIds.length - 1"
          @navigate="navigateToRoadmap(id)"
          @move-up="handleRoadmapMoveUp(id)"
          @move-down="handleRoadmapMoveDown(id)"
          @edit="handleRoadmapEdit(id)"
          @delete="(password) => handleRoadmapDelete(id, password)"
          @update-color="(color) => handleRoadmapUpdateColor(id, color)"
          @update-roadmap="(updates) => handleRoadmapUpdate(id, updates)"
          @mark-complete="handleRoadmapMarkComplete(id)"
          @mark-incomplete="handleRoadmapMarkIncomplete(id)"
          @export="handleExportRoadmap(id)"
        />
      </div>

      <!-- No results message -->
      <div v-if="filteredRoadmapIds.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">
          Nenhum roadmap encontrado para os filtros selecionados.
        </p>
        <AppButton
          variant="ghost"
          size="sm"
          @click="() => { filterName = ''; filterStatus = 'all' }"
          class="mt-3"
        >
          Limpar filtros
        </AppButton>
      </div>

      <!-- Recent Activity -->
      <div v-if="dailyLogStore.last7Days.length > 0" class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Atividade Recente</h2>
        <div class="space-y-2">
          <DailyLogEntry
            v-for="log in dailyLogStore.last7Days.slice(0, 3)"
            :key="log.id"
            :entry="log"
            :compact="true"
          />
        </div>
      </div>

      <!-- Modal para criar novo roadmap -->
      <AppModal
        :open="showAddRoadmapModal"
        title="Criar Novo Roadmap"
        submit-label="Criar"
        cancel-label="Cancelar"
        @submit="createNewRoadmap"
        @cancel="showAddRoadmapModal = false"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Roadmap
            </label>
            <input
              v-model="newRoadmapTitle"
              type="text"
              placeholder="Ex: Gramática, Redação, Análise Combinatória"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
              @keyup.enter="createNewRoadmap"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              v-model="newRoadmapDescription"
              placeholder="Descreva o foco deste roadmap..."
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              v-model="newRoadmapCategory"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Direito">Direito</option>
              <option value="Matemática">Matemática</option>
              <option value="Português">Português</option>
              <option value="Informática">Informática</option>
              <option value="Administração">Administração</option>
              <option value="Economia">Economia</option>
              <option value="Engenharia">Engenharia</option>
              <option value="Medicina">Medicina</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (separadas por vírgula)
            </label>
            <input
              v-model="newRoadmapTags"
              type="text"
              placeholder="Ex: concursos, estudo, preparação"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visibilidade
            </label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  v-model="newRoadmapVisibility"
                  type="radio"
                  value="private"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Privado</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="newRoadmapVisibility"
                  type="radio"
                  value="public"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Público</span>
              </label>
            </div>
          </div>
        </div>
      </AppModal>
    </div>

    <!-- Import Modal -->
    <AppModal
      :open="showImportModal"
      title="Importar Roadmap"
      submit-label="Importar"
      cancel-label="Cancelar"
      @submit="handleImportRoadmap"
      @cancel="showImportModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Arquivo JSON
          </label>
          <input
            type="file"
            accept=".json"
            @change="handleFileImport"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
          />
        </div>
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">ou</div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cole os dados do Roadmap (JSON)
          </label>
          <textarea
            v-model="importData"
            rows="8"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-base"
            placeholder="Cole os dados JSON do roadmap aqui..."
          />
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          <p>Dicas:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Selecione um arquivo .json ou cole os dados diretamente</li>
            <li>Peça o arquivo para quem compartilhou o roadmap</li>
          </ul>
        </div>
      </div>
    </AppModal>

    <!-- Global Search Modal -->
    <AppModal
      :open="showGlobalSearch"
      title="Busca Global"
      submit-label="Buscar"
      cancel-label="Fechar"
      @submit="performGlobalSearch"
      @cancel="showGlobalSearch = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar em todos os roadmaps
          </label>
          <input
            v-model="globalSearchQuery"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
            placeholder="Digite para buscar roadmaps, módulos, tópicos ou recursos..."
            @keyup.enter="performGlobalSearch"
          />
        </div>
        
        <!-- Search Results -->
        <div v-if="globalSearchResults.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Resultados encontrados ({{ globalSearchResults.length }})
          </div>
          
          <div
            v-for="result in globalSearchResults"
            :key="`${result.type}-${result.id}`"
            @click="navigateToSearchResult(result)"
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs px-2 py-1 rounded" 
                    :class="{
                      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': result.type === 'roadmap',
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': result.type === 'block',
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': result.type === 'topic',
                      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': result.type === 'resource'
                    }">
                    {{ result.type === 'roadmap' ? 'Roadmap' : 
                       result.type === 'block' ? 'Módulo' : 
                       result.type === 'topic' ? 'Tópico' : 'Recurso' }}
                  </span>
                  <h4 class="font-semibold text-gray-900 dark:text-white truncate">
                    {{ result.title }}
                  </h4>
                </div>
                <p v-if="result.description" class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ result.description }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ result.roadmapTitle }}
                  </span>
                  <span v-if="result.category" class="text-xs px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {{ result.category }}
                  </span>
                </div>
                <div v-if="result.tags && result.tags.length > 0" class="flex gap-1 mt-1">
                  <span 
                    v-for="tag in result.tags.slice(0, 3)" 
                    :key="tag" 
                    class="text-xs px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="result.tags.length > 3" class="text-xs text-gray-500 dark:text-gray-400">
                    +{{ result.tags.length - 3 }}
                  </span>
                </div>
              </div>
              <AppIcon name="chevron-right" size="sm" class="text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>
        
        <div v-else-if="globalSearchQuery.trim() && globalSearchResults.length === 0" class="text-center py-6">
          <p class="text-gray-600 dark:text-gray-400">
            Nenhum resultado encontrado para "{{ globalSearchQuery }}"
          </p>
        </div>
        
        <div v-else-if="!globalSearchQuery.trim()" class="text-center py-6">
          <p class="text-gray-600 dark:text-gray-400">
            Digite algo para buscar em todos os seus roadmaps
          </p>
        </div>
      </div>
    </AppModal>
  </div>
</template>
