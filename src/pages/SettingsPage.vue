<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'
import { api } from '@/services/api'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()

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
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <button
          @click="router.push('/')"
          class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <AppIcon name="home" size="sm" />
          Início
        </button>
        <span class="text-gray-400">•</span>
        <span class="font-medium text-gray-900 dark:text-white">Configurações</span>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>

      <div class="space-y-6">
        <!-- Segurança -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Segurança</h3>
          <div class="space-y-3">
            <div>
              <label class="block">
                <span class="text-sm text-gray-700 dark:text-gray-300">Senha Atual</span>
                <input
                  v-model="currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </label>
            </div>
            <div>
              <label class="block">
                <span class="text-sm text-gray-700 dark:text-gray-300">Nova Senha</span>
                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="Digite a nova senha"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </label>
            </div>
            <div>
              <label class="block">
                <span class="text-sm text-gray-700 dark:text-gray-300">Confirmar Nova Senha</span>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Confirme a nova senha"
                  class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </label>
            </div>
            <AppButton
              variant="primary"
              @click="updatePassword"
              :disabled="isChangingPassword"
              class="w-full"
            >
              {{ isChangingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </AppButton>
            <div v-if="passwordError" class="text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded">
              ✓ Senha alterada com sucesso!
            </div>
          </div>
        </div>

        <!-- Tema -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Tema</h3>
          <AppButton
            variant="primary"
            @click="settingsStore.toggleTheme"
          >
            Atual: {{ settingsStore.settings.theme }} (Alternar)
          </AppButton>
        </div>

        <!-- Comportamento -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Comportamento</h3>
          <label class="flex items-start gap-3 cursor-pointer select-none">
            <input
              v-model="settingsStore.settings.markViewedOnOpen"
              type="checkbox"
              class="mt-1"
            />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Marcar recurso como visto ao abrir
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Ao clicar no título/link do recurso, ele será marcado como visto automaticamente.
              </p>
            </div>
          </label>
        </div>

        <!-- Metas -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Metas Diárias</h3>
          <div class="space-y-3">
            <label class="block">
              <span class="text-gray-700 dark:text-gray-300">Minutos de estudo</span>
              <input
                v-model.number="settingsStore.settings.dailyGoalMinutes"
                type="number"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </label>
            <label class="block">
              <span class="text-gray-700 dark:text-gray-300">Questões a resolver</span>
              <input
                v-model.number="settingsStore.settings.dailyGoalQuestoes"
                type="number"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </label>
          </div>
        </div>

        <!-- Backup/Restauração -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Backup e Restauração</h3>
          <div class="flex gap-2">
            <AppButton
              variant="secondary"
              @click="exportJSON"
              class="flex-1"
            >
              📥 Exportar JSON
            </AppButton>
            <label class="flex-1">
              <AppButton
                variant="secondary"
                class="w-full"
              >
                📤 Importar JSON
              </AppButton>
              <input
                type="file"
                accept=".json"
                @change="importJSON"
                class="hidden"
              />
            </label>
          </div>
        </div>

        <!-- Sobre -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Sobre</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Desenvolvedor: <span class="font-semibold">Maison</span>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Projeto pessoal para organização de estudos e evolução contínua do produto.
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Repositório: <a class="text-blue-600 dark:text-blue-400 hover:underline" href="https://github.com/maisondev/concursos-portugues" target="_blank" rel="noreferrer">GitHub</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
