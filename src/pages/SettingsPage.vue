<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()

const newPassword = ref('')
const confirmPassword = ref('')
const currentPassword = ref('')

function updatePassword() {
  if (!currentPassword.value) {
    alert('Digite a senha atual')
    return
  }

  if (currentPassword.value !== settingsStore.settings.deletePassword) {
    alert('Senha atual incorreta')
    currentPassword.value = ''
    return
  }

  if (!newPassword.value || !confirmPassword.value) {
    alert('Digite a nova senha')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('As senhas não coincidem')
    return
  }

  if (newPassword.value === currentPassword.value) {
    alert('A nova senha deve ser diferente da senha atual')
    return
  }

  settingsStore.updateSettings({ deletePassword: newPassword.value })
  alert('Senha alterada com sucesso!')
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
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
              class="w-full"
            >
              Alterar Senha
            </AppButton>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Senha atual: <strong>{{ settingsStore.settings.deletePassword }}</strong> (apenas para referência)
            </p>
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
      </div>
    </div>
  </div>
</template>
