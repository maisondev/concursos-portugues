<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref<any>(null)
const users = ref<any[]>([])
const activity = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref<'stats' | 'users' | 'activity'>('stats')
const togglingUserId = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)
const showDeleteModal = ref(false)
const userToDelete = ref<any>(null)

onMounted(async () => {
  // Verificar se é admin (para futuro, agora só admin consegue acessar)
  await loadStats()
})

async function loadStats() {
  isLoading.value = true
  error.value = null

  try {
    const [statsData, usersData, activityData] = await Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/users'),
      api.get('/api/admin/activity')
    ])

    stats.value = statsData
    users.value = usersData
    activity.value = activityData
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar dados'
    console.error(error.value)
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function toggleAdmin(user: any) {
  togglingUserId.value = user.id
  try {
    const updated = await api.patch(`/api/admin/users/${user.id}/admin`, {
      isAdmin: !user.isAdmin
    })
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users.value[idx].isAdmin = updated.isAdmin
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao alterar permissão'
  } finally {
    togglingUserId.value = null
  }
}

function confirmDelete(user: any) {
  userToDelete.value = user
  showDeleteModal.value = true
}

async function confirmDeleteUser() {
  if (!userToDelete.value) return

  const user = userToDelete.value
  deletingUserId.value = user.id
  try {
    await api.delete(`/api/admin/users/${user.id}`)
    users.value = users.value.filter(u => u.id !== user.id)
    error.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao deletar usuário'
  } finally {
    deletingUserId.value = null
    showDeleteModal.value = false
    userToDelete.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-light dark:bg-gray-900 p-4">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Painel de Administrador</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Acompanhe a evolução do produto</p>
        </div>
        <AppButton
          variant="secondary"
          size="sm"
          @click="router.push('/')"
          class="flex items-center gap-2"
        >
          ← Voltar
        </AppButton>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          @click="activeTab = 'stats'"
          :class="[
            'px-4 py-2 font-medium transition-colors',
            activeTab === 'stats'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          📊 Estatísticas
        </button>
        <button
          @click="activeTab = 'users'"
          :class="[
            'px-4 py-2 font-medium transition-colors',
            activeTab === 'users'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          👥 Usuários
        </button>
        <button
          @click="activeTab = 'activity'"
          :class="[
            'px-4 py-2 font-medium transition-colors',
            activeTab === 'activity'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          📝 Atividades
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
        <AppButton variant="secondary" size="sm" @click="loadStats" class="mt-2">
          Tentar novamente
        </AppButton>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Carregando dados...</p>
      </div>

      <!-- Stats Tab -->
      <div v-else-if="activeTab === 'stats' && stats" class="space-y-6">
        <!-- KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</p>
            <p class="text-3xl font-bold text-primary mt-2">{{ stats.totalUsers }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ stats.usersToday }} hoje</p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total de Roadmaps</p>
            <p class="text-3xl font-bold text-primary mt-2">{{ stats.totalRoadmaps }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ stats.roadmapsWeek }} esta semana</p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total de Blocos</p>
            <p class="text-3xl font-bold text-primary mt-2">{{ stats.totalBlocks }}</p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total de Tópicos</p>
            <p class="text-3xl font-bold text-primary mt-2">{{ stats.totalTopics }}</p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total de Recursos</p>
            <p class="text-3xl font-bold text-primary mt-2">{{ stats.totalResources }}</p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total de Logs</p>
            <p class="text-3xl font-bold text-primary mt-2">{{ stats.totalLogs }}</p>
          </div>
        </div>

        <!-- Top Users -->
        <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Top 5 Usuários Mais Ativos</h3>
          <div class="space-y-2">
            <div
              v-for="(user, idx) in stats.topUsers"
              :key="idx"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <span class="text-sm text-gray-900 dark:text-white">{{ user.email }}</span>
              <span class="text-sm font-semibold text-primary">{{ user.roadmapCount }} roadmaps</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-else-if="activeTab === 'users' && users" class="space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Email</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Roadmaps</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Logs</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Cadastro</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ user.email }}</td>
                <td class="px-4 py-3">
                  <span v-if="user.isAdmin" class="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                    Admin
                  </span>
                  <span v-else class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded">
                    Usuário
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user._count.roadmaps }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user._count.logs }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ formatDate(user.createdAt) }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      @click="toggleAdmin(user)"
                      :disabled="togglingUserId === user.id || deletingUserId === user.id || authStore.user?.id === user.id"
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded transition-colors',
                        togglingUserId === user.id || deletingUserId === user.id
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                          : authStore.user?.id === user.id
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                            : user.isAdmin
                              ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60'
                              : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60'
                      ]"
                    >
                      {{ togglingUserId === user.id ? '...' : (user.isAdmin ? 'Remover' : 'Promover') }}
                    </button>
                    <button
                      @click="confirmDelete(user)"
                      :disabled="deletingUserId === user.id || togglingUserId === user.id || authStore.user?.id === user.id"
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded transition-colors',
                        deletingUserId === user.id || togglingUserId === user.id
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                          : authStore.user?.id === user.id
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/60'
                      ]"
                    >
                      {{ deletingUserId === user.id ? '...' : 'Deletar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-else-if="activeTab === 'activity' && activity" class="space-y-4">
        <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Roadmaps Recentes</h3>
          <div class="space-y-2">
            <div
              v-for="roadmap in activity.recentRoadmaps"
              :key="roadmap.id"
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ roadmap.title }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Por: <strong>{{ roadmap.user.email }}</strong> em {{ formatDate(roadmap.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="flex justify-end">
        <AppButton
          variant="secondary"
          size="sm"
          @click="loadStats"
          :disabled="isLoading"
          class="flex items-center gap-2"
        >
          🔄 Atualizar
        </AppButton>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <AppModal
    :open="showDeleteModal"
    title="Confirmar Exclusão"
    submit-label="Deletar"
    submit-variant="danger"
    cancel-label="Cancelar"
    @submit="confirmDeleteUser"
    @cancel="showDeleteModal = false"
  >
    <div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja deletar o usuário <strong>{{ userToDelete?.email }}</strong>?
      </p>
      <p class="text-sm text-red-600 dark:text-red-400 font-semibold">
        ⚠️ Esta ação não pode ser desfeita. Todos os roadmaps, logs e dados do usuário serão permanentemente removidos.
      </p>
    </div>
  </AppModal>
</template>
