<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const agreed = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function accept() {
  if (!agreed.value) return
  error.value = null
  isLoading.value = true
  try {
    await authStore.giveConsent()
  } catch {
    error.value = 'Erro ao salvar. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="authStore.needsConsent"
      class="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <!-- Header -->
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🔒</span>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Política de Privacidade atualizada</h2>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Para continuar usando o Sinapses, precisamos do seu consentimento conforme a LGPD.
          </p>
        </div>

        <!-- Resumo dos dados -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
          <p class="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wide">O que coletamos</p>
          <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li class="flex items-start gap-2"><span class="text-blue-500 mt-0.5">•</span> E-mail e nome (para identificação)</li>
            <li class="flex items-start gap-2"><span class="text-blue-500 mt-0.5">•</span> Roadmaps e conteúdos que você cria</li>
            <li class="flex items-start gap-2"><span class="text-blue-500 mt-0.5">•</span> Registros de estudo (tempo, notas, humor)</li>
          </ul>
          <p class="text-xs text-gray-500 dark:text-gray-400 pt-1">Seus dados <strong>não são vendidos</strong> nem compartilhados com terceiros para fins comerciais.</p>
        </div>

        <!-- Checkbox -->
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            v-model="agreed"
            type="checkbox"
            class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer flex-shrink-0"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Li e aceito a
            <router-link to="/privacidade" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Política de Privacidade</router-link>
            e os
            <router-link to="/termos" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Termos de Serviço</router-link>
            do Sinapses.
          </span>
        </label>

        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>

        <!-- Botão -->
        <button
          @click="accept"
          :disabled="!agreed || isLoading"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          {{ isLoading ? 'Salvando...' : 'Aceitar e continuar' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>
