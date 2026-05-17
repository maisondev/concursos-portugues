<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/atoms/AppButton.vue'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const policy = ref<{ version: string; lastUpdated: string; title: string; sections: { title: string; content: string }[] } | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/privacy-policy`)
    if (!res.ok) throw new Error('Erro ao carregar')
    policy.value = await res.json()
  } catch {
    error.value = 'Não foi possível carregar a Política de Privacidade.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div class="flex items-center gap-3">
        <AppButton variant="ghost" size="sm" @click="router.back()">← Voltar</AppButton>
      </div>

      <div v-if="isLoading" class="text-center py-16 text-gray-500 dark:text-gray-400">
        Carregando...
      </div>

      <div v-else-if="error" class="text-center py-16 text-red-600 dark:text-red-400">
        {{ error }}
      </div>

      <template v-else-if="policy">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ policy.title }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Versão {{ policy.version }} — Última atualização: {{ policy.lastUpdated }}
          </p>
        </div>

        <div class="space-y-6">
          <div
            v-for="section in policy.sections"
            :key="section.title"
            class="space-y-2"
          >
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ section.title }}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ section.content }}</p>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <router-link to="/termos" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Ver também: Termos de Serviço →
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>
