<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'
import { api } from '@/services/api'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppCheckbox from '@/components/atoms/AppCheckbox.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import MD5 from 'crypto-js/md5'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()

const activeSection = ref<'perfil' | 'conta' | 'aparencia' | 'preferencias' | 'metas' | 'dados' | 'privacidade' | 'sobre'>('perfil')

const sections = [
  { id: 'perfil', label: 'Perfil', icon: 'user' },
  { id: 'conta', label: 'Conta', icon: 'lock' },
  { id: 'aparencia', label: 'Aparência', icon: 'sun' },
  { id: 'preferencias', label: 'Preferências', icon: 'sliders-horizontal' },
  { id: 'metas', label: 'Metas Diárias', icon: 'target' },
  { id: 'dados', label: 'Dados', icon: 'database' },
  { id: 'privacidade', label: 'Privacidade', icon: 'shield' },
  { id: 'sobre', label: 'Sobre', icon: 'info' }
]

function getGravatarUrl(email: string): string {
  const emailLower = email.toLowerCase().trim()
  const hash = MD5(emailLower).toString()
  return `https://www.gravatar.com/avatar/${hash}?s=128&d=identicon`
}

const profileName = ref(authStore.user?.name || '')
const profileAvatar = ref(authStore.user?.avatar || '')
const isEditingProfile = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref(false)

const currentAvatarUrl = computed(() => {
  if (profileAvatar.value) return profileAvatar.value
  return getGravatarUrl(authStore.userEmail || '')
})

async function updateProfile() {
  profileError.value = null
  profileSuccess.value = false
  isEditingProfile.value = true

  try {
    await authStore.updateProfile(
      profileName.value.trim() || undefined,
      profileAvatar.value.trim() === '' ? null : profileAvatar.value.trim()
    )
    profileSuccess.value = true
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
  } catch (error) {
    profileError.value = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
  } finally {
    isEditingProfile.value = false
  }
}

function resetAvatar() {
  profileAvatar.value = ''
}

const newPassword = ref('')
const confirmPassword = ref('')
const currentPassword = ref('')
const isChangingPassword = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref(false)

async function updatePassword() {
  passwordError.value = null
  passwordSuccess.value = false

  if (!currentPassword.value) {
    passwordError.value = 'Digite a senha atual'
    return
  }

  if (!newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Digite a nova senha'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'As senhas não coincidem'
    return
  }

  if (newPassword.value === currentPassword.value) {
    passwordError.value = 'A nova senha deve ser diferente da senha atual'
    return
  }

  if (newPassword.value.length < 6) {
    passwordError.value = 'A nova senha deve ter no mínimo 6 caracteres'
    return
  }

  isChangingPassword.value = true

  try {
    await api.post('/api/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })

    passwordSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    setTimeout(() => {
      passwordSuccess.value = false
    }, 3000)
  } catch (error) {
    passwordError.value = error instanceof Error ? error.message : 'Erro ao alterar senha'
  } finally {
    isChangingPassword.value = false
  }
}

// LGPD
const isExportingData = ref(false)
const exportDataError = ref<string | null>(null)
const showDeleteModal = ref(false)
const deletePassword = ref('')
const isDeletingAccount = ref(false)
const deleteError = ref<string | null>(null)

async function exportPersonalData() {
  exportDataError.value = null
  isExportingData.value = true
  try {
    await authStore.exportData()
  } catch (error) {
    exportDataError.value = error instanceof Error ? error.message : 'Erro ao exportar dados'
  } finally {
    isExportingData.value = false
  }
}

async function confirmDeleteAccount() {
  deleteError.value = null
  if (!deletePassword.value) {
    deleteError.value = 'Digite sua senha para confirmar'
    return
  }
  isDeletingAccount.value = true
  try {
    await authStore.deleteAccount(deletePassword.value)
    router.push('/')
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : 'Erro ao excluir conta'
    isDeletingAccount.value = false
  }
}

function exportJSON() {
  const data = {
    roadmaps: roadmapStore.roadmaps,
    dailyLogs: dailyLogStore.logs,
    settings: settingsStore.settings,
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `roadmap-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importJSON(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.roadmaps) roadmapStore.roadmaps = data.roadmaps
      if (data.dailyLogs) dailyLogStore.logs = data.dailyLogs
      if (data.settings) settingsStore.updateSettings(data.settings)
      alert('Dados importados com sucesso!')
    } catch (error) {
      alert('Erro ao importar JSON: ' + error)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header com breadcrumb -->
    <div class="border-b border-gray-200 dark:border-gray-800 p-4">
      <div class="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <button @click="router.push('/')" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          <AppIcon name="home" size="sm" />
          Início
        </button>
        <span>•</span>
        <span class="font-medium text-gray-900 dark:text-white">Configurações</span>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white max-w-7xl mx-auto">Configurações</h1>
    </div>

    <!-- Main content: Sidebar + Content -->
    <div class="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-6">
      <!-- Sidebar Navigation (Desktop) -->
      <nav class="hidden md:flex flex-col gap-1">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="activeSection = section.id as typeof activeSection"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-l-4 text-left',
            activeSection === section.id
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-600'
              : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
          ]"
        >
          <AppIcon :name="section.icon" size="sm" />
          {{ section.label }}
        </button>
      </nav>

      <!-- Tabs Navigation (Mobile) -->
      <div class="md:hidden -mx-4 px-4 mb-4">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id as typeof activeSection"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ section.label }}
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="space-y-6">
        <!-- Seção: Perfil -->
        <div v-if="activeSection === 'perfil'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
              <AppIcon name="user" size="sm" class="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Perfil</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Personalize seu perfil</p>
            </div>
          </div>
          <div class="space-y-4">
            <!-- Avatar -->
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Foto de Perfil</p>
              <div class="flex items-center gap-4">
                <img :src="currentAvatarUrl" :alt="authStore.username || 'Avatar'" class="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ profileAvatar ? 'URL customizada' : 'Usando Gravatar' }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Email: {{ authStore.userEmail }}</p>
                </div>
              </div>

              <!-- Gravatar info -->
              <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p class="text-xs text-blue-900 dark:text-blue-300">
                  <strong>Gravatar</strong> é um serviço gratuito que associa sua foto a seu email. Ao usar Gravatar, sua foto aparecerá automaticamente em muitos sites que usam este serviço.
                </p>
              </div>

              <div class="mt-4 space-y-3">
                <label class="block">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">URL customizada da foto (opcional)</span>
                  <input v-model="profileAvatar" type="url" placeholder="https://exemplo.com/foto.jpg"
                    class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                </label>
                <div class="flex gap-2">
                  <AppButton variant="ghost" size="sm" @click="resetAvatar" class="flex-1">
                    Usar Gravatar
                  </AppButton>
                  <AppButton
                    variant="secondary"
                    size="sm"
                    @click="window.open('https://gravatar.com', '_blank')"
                    class="flex-1"
                    title="Abre Gravatar em uma nova aba"
                  >
                    Configurar Gravatar ↗
                  </AppButton>
                </div>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label class="block">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</span>
                <input v-model="profileName" type="text" placeholder="Seu nome completo"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </label>
            </div>

            <AppButton variant="primary" @click="updateProfile" :disabled="isEditingProfile" class="w-full">
              {{ isEditingProfile ? 'Salvando...' : 'Salvar Perfil' }}
            </AppButton>

            <div v-if="profileError" class="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {{ profileError }}
            </div>
            <div v-if="profileSuccess" class="text-sm text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              ✓ Perfil atualizado com sucesso!
            </div>
          </div>
        </div>

        <!-- Seção: Conta -->
        <div v-if="activeSection === 'conta'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <AppIcon name="lock" size="sm" class="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Conta</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Gerenciar segurança da sua conta</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">Senha Atual</span>
                <input v-model="currentPassword" type="password" placeholder="Digite sua senha atual"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </label>
            </div>
            <div>
              <label class="block"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">Nova Senha</span>
                <input v-model="newPassword" type="password" placeholder="Digite a nova senha"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </label>
            </div>
            <div>
              <label class="block"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</span>
                <input v-model="confirmPassword" type="password" placeholder="Confirme a nova senha"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </label>
            </div>
            <AppButton variant="primary" @click="updatePassword" :disabled="isChangingPassword" class="w-full">
              {{ isChangingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </AppButton>
            <div v-if="passwordError" class="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="text-sm text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              ✓ Senha alterada com sucesso!
            </div>
          </div>
        </div>

        <!-- Seção: Aparência -->
        <div v-if="activeSection === 'aparencia'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <AppIcon name="sun" size="sm" class="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Aparência</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Personalize a aparência da aplicação</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Tema</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Tema atual: <span class="font-semibold capitalize">{{ settingsStore.settings.theme }}</span></p>
              </div>
              <AppButton variant="secondary" size="sm" @click="settingsStore.toggleTheme">Alternar</AppButton>
            </div>
          </div>
        </div>

        <!-- Seção: Preferências -->
        <div v-if="activeSection === 'preferencias'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <AppIcon name="sliders-horizontal" size="sm" class="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Preferências</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Configure o comportamento da aplicação</p>
            </div>
          </div>
          <label class="flex items-start gap-3 cursor-pointer select-none p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
            <AppCheckbox v-model="settingsStore.settings.markViewedOnOpen" class="mt-1" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Marcar recurso como visto ao abrir</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Marca automaticamente como visto ao clicar no recurso</p>
            </div>
          </label>
        </div>

        <!-- Seção: Metas Diárias -->
        <div v-if="activeSection === 'metas'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <AppIcon name="target" size="sm" class="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Metas Diárias</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Defina suas metas de aprendizado</p>
            </div>
          </div>
          <div class="space-y-4">
            <label class="block">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Minutos de estudo por dia</span>
              <input v-model.number="settingsStore.settings.dailyGoalMinutes" type="number" min="0"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Questões a resolver por dia</span>
              <input v-model.number="settingsStore.settings.dailyGoalQuestoes" type="number" min="0"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </label>
          </div>
        </div>

        <!-- Seção: Dados -->
        <div v-if="activeSection === 'dados'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <AppIcon name="database" size="sm" class="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Dados</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Exporte e importe seu backup</p>
            </div>
          </div>
          <div class="space-y-3">
            <AppButton variant="secondary" @click="exportJSON" class="w-full">📥 Exportar JSON</AppButton>
            <label class="block">
              <AppButton variant="secondary" class="w-full">📤 Importar JSON</AppButton>
              <input type="file" accept=".json" @change="importJSON" class="hidden" />
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400">Faça backup de todos seus roadmaps, logs e configurações</p>
          </div>
        </div>

        <!-- Seção: Privacidade & LGPD -->
        <div v-if="activeSection === 'privacidade'" class="space-y-4">
          <!-- Seus direitos -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
            <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div class="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <AppIcon name="shield" size="sm" class="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 class="font-semibold text-gray-900 dark:text-white">Privacidade & LGPD</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Seus direitos conforme a Lei Geral de Proteção de Dados</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>Coletamos apenas os dados necessários para o funcionamento do Sinapses: e-mail, nome (opcional), e seu conteúdo de estudos. Você tem controle total sobre seus dados.</p>
              <div class="flex flex-wrap gap-2">
                <router-link to="/privacidade" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  Política de Privacidade ↗
                </router-link>
                <router-link to="/termos" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  Termos de Serviço ↗
                </router-link>
              </div>
            </div>
          </div>

          <!-- Exportar dados -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Portabilidade de Dados</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Baixe uma cópia completa de todos os seus dados pessoais (Art. 18, V, LGPD)</p>
            </div>
            <AppButton variant="secondary" @click="exportPersonalData" :disabled="isExportingData" class="w-full">
              {{ isExportingData ? 'Exportando...' : 'Baixar meus dados (JSON)' }}
            </AppButton>
            <div v-if="exportDataError" class="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {{ exportDataError }}
            </div>
          </div>

          <!-- Zona de perigo -->
          <div class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl p-6 space-y-4">
            <div>
              <h3 class="font-semibold text-red-700 dark:text-red-400 mb-1">Zona de Perigo</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">A exclusão da conta é permanente e irreversível. Todos os seus dados serão apagados (Art. 18, VI, LGPD).</p>
            </div>
            <AppButton variant="danger" @click="showDeleteModal = true" class="w-full">
              Excluir minha conta permanentemente
            </AppButton>
          </div>
        </div>

        <!-- Modal confirmação de exclusão de conta -->
        <AppModal
          :open="showDeleteModal"
          title="Excluir conta permanentemente"
          submit-label="Confirmar exclusão"
          cancel-label="Cancelar"
          submit-variant="danger"
          @submit="confirmDeleteAccount"
          @cancel="showDeleteModal = false; deletePassword = ''; deleteError = null"
        >
          <div class="space-y-4">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Esta ação é <strong>irreversível</strong>. Todos os seus roadmaps, registros, configurações e dados pessoais serão permanentemente excluídos.
            </p>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Digite sua senha para confirmar
              </label>
              <input
                v-model="deletePassword"
                type="password"
                placeholder="Sua senha atual"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                @keyup.enter="confirmDeleteAccount"
              />
            </div>
            <div v-if="deleteError" class="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {{ deleteError }}
            </div>
          </div>
        </AppModal>

        <!-- Seção: Sobre -->
        <div v-if="activeSection === 'sobre'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <AppIcon name="info" size="sm" class="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Sobre</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Informações sobre a aplicação</p>
            </div>
          </div>
          <div class="space-y-3 text-sm">
            <p><span class="font-medium text-gray-900 dark:text-white">Desenvolvedor:</span> <span class="text-gray-600 dark:text-gray-400">Maison</span></p>
            <p><span class="font-medium text-gray-900 dark:text-white">Projeto:</span> <span class="text-gray-600 dark:text-gray-400">Organização de estudos com roadmaps e rastreamento de progresso</span></p>
            <p><span class="font-medium text-gray-900 dark:text-white">Domínio:</span> <a href="https://sinapses.site" target="_blank" rel="noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">sinapses.site</a></p>
            <p><span class="font-medium text-gray-900 dark:text-white">GitHub:</span> <a href="https://github.com/maisondev" target="_blank" rel="noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">@maisondev</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
