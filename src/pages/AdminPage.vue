<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref<any>(null)
const users = ref<any[]>([])
const activity = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref<'stats' | 'users' | 'activity' | 'notifications'>('stats')
const togglingUserId = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)
const showDeleteModal = ref(false)
const userToDelete = ref<any>(null)

// Notification form state
const selectedUserId = ref<string>('')
const notificationTitle = ref('')
const notificationMessage = ref('')
const notificationType = ref<'info' | 'success' | 'warning' | 'error'>('info')
const isSendingNotification = ref(false)
const notificationSendError = ref<string | null>(null)
const notificationSendSuccess = ref(false)

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

async function changeRole(user: any, newRole: string) {
  togglingUserId.value = user.id
  try {
    const updated = await api.patch(`/api/admin/users/${user.id}/role`, {
      role: newRole
    })
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users.value[idx].role = updated.role
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao alterar role'
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

async function sendNotification() {
  notificationSendError.value = null
  notificationSendSuccess.value = false

  if (!selectedUserId.value || !notificationTitle.value || !notificationMessage.value) {
    notificationSendError.value = 'Preencha todos os campos'
    return
  }

  isSendingNotification.value = true

  try {
    await api.post('/api/admin/send-notification', {
      userId: selectedUserId.value,
      title: notificationTitle.value,
      message: notificationMessage.value,
      type: notificationType.value
    })

    notificationSendSuccess.value = true
    selectedUserId.value = ''
    notificationTitle.value = ''
    notificationMessage.value = ''
    notificationType.value = 'info'

    setTimeout(() => {
      notificationSendSuccess.value = false
    }, 3000)
  } catch (err) {
    notificationSendError.value = err instanceof Error ? err.message : 'Erro ao enviar notificação'
  } finally {
    isSendingNotification.value = false
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
      <div class="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-2">
        <button
          @click="activeTab = 'stats'"
          :class="[
            'px-4 py-3 font-medium transition-colors whitespace-nowrap',
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
            'px-4 py-3 font-medium transition-colors whitespace-nowrap',
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
            'px-4 py-3 font-medium transition-colors whitespace-nowrap',
            activeTab === 'activity'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          📝 Atividades
        </button>
        <button
          @click="activeTab = 'notifications'"
          :class="[
            'px-4 py-3 font-medium transition-colors whitespace-nowrap',
            activeTab === 'notifications'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          🔔 Notificações
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
                  <span v-if="user.role === 'OWNER'" class="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded">
                    👑 Owner
                  </span>
                  <span v-else-if="user.role === 'ADMIN'" class="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
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
                  <div class="flex gap-2 items-center">
                    <select
                      :value="user.role"
                      @change="(e) => changeRole(user, (e.target as HTMLSelectElement).value)"
                      :disabled="togglingUserId === user.id || deletingUserId === user.id || authStore.user?.id === user.id || !authStore.isOwner"
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="USER">Usuário</option>
                      <option value="ADMIN">Admin</option>
                      <option value="OWNER">Owner</option>
                    </select>
                    <button
                      @click="confirmDelete(user)"
                      :disabled="deletingUserId === user.id || togglingUserId === user.id || authStore.user?.id === user.id || !authStore.isOwner"
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded transition-colors',
                        deletingUserId === user.id || togglingUserId === user.id || !authStore.isOwner
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

      <!-- Notifications Tab -->
      <div v-else-if="activeTab === 'notifications' && users" class="space-y-6">
        <div class="p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Enviar Notificação para Usuário</h3>

          <div class="space-y-4">
            <!-- Mensagem de sucesso -->
            <div v-if="notificationSendSuccess" class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p class="text-sm text-green-600 dark:text-green-400">✓ Notificação enviada com sucesso!</p>
            </div>

            <!-- Mensagem de erro -->
            <div v-if="notificationSendError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-600 dark:text-red-400">{{ notificationSendError }}</p>
            </div>

            <!-- Formulário -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selecione um usuário
                </label>
                <select
                  v-model="selectedUserId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">-- Selecione um usuário --</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.email }} ({{ user.role }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Notificação
                </label>
                <select
                  v-model="notificationType"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="info">ℹ️ Informação</option>
                  <option value="success">✓ Sucesso</option>
                  <option value="warning">⚠️ Aviso</option>
                  <option value="error">❌ Erro</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  v-model="notificationTitle"
                  type="text"
                  placeholder="Título da notificação"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  v-model="notificationMessage"
                  placeholder="Mensagem da notificação"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <AppButton
                variant="primary"
                @click="sendNotification"
                :disabled="isSendingNotification"
                class="w-full"
              >
                {{ isSendingNotification ? 'Enviando...' : '🔔 Enviar Notificação' }}
              </AppButton>
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
    <div class="space-y-3">
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja deletar o usuário <strong>{{ userToDelete?.email }}</strong>?
      </p>
      <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
          ⚠️ Esta ação não pode ser desfeita. Todos os roadmaps, logs e dados do usuário serão permanentemente removidos.
        </p>
      </div>
    </div>
  </AppModal>
</template>
