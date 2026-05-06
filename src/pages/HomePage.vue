<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useProgressStore } from '@/stores/progress'
import AppButton from '@/components/atoms/AppButton.vue'
import StatBadge from '@/components/molecules/StatBadge.vue'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'

const router = useRouter()
const dailyLogStore = useDailyLogStore()
const progressStore = useProgressStore()

dailyLogStore.initLogs()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto p-4 space-y-8">
      <!-- Header -->
      <div class="text-center py-8">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-3">
          📚 Interpretação de Textos
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-2">
          Roadmap de Estudo para Concursos Públicos
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          16 módulos • 100+ tópicos • Acompanhamento diário
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBadge
          label="Progresso Geral"
          :value="`${progressStore.overallPercent}%`"
          icon="📊"
          :color="progressStore.overallPercent > 50 ? 'green' : progressStore.overallPercent > 20 ? 'yellow' : 'red'"
        />
        <StatBadge
          label="Streak 🔥"
          :value="dailyLogStore.streakDays"
          icon="🔥"
          color="purple"
        />
        <StatBadge
          label="Questões Resolvidas"
          :value="progressStore.snapshotInterpretacao.totalQuestoes"
          icon="✅"
          color="blue"
        />
      </div>

      <!-- CTA Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppButton
          variant="primary"
          size="lg"
          @click="router.push('/roadmap/interpretacao-textos')"
          class="w-full h-16 text-lg"
        >
          🗺️ Ver Roadmap Completo
        </AppButton>
        <AppButton
          variant="secondary"
          size="lg"
          @click="router.push('/dashboard')"
          class="w-full h-16 text-lg"
        >
          📊 Ir para Dashboard
        </AppButton>
      </div>

      <!-- Today's Log Preview -->
      <div v-if="dailyLogStore.todayLog" class="p-6 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">✅ Você já registrou hoje!</h2>
        <DailyLogEntry :entry="dailyLogStore.todayLog" />
        <AppButton
          variant="ghost"
          size="sm"
          @click="router.push('/dashboard')"
          class="mt-3"
        >
          Editar registro →
        </AppButton>
      </div>

      <!-- Recent Activity -->
      <div v-if="dailyLogStore.last7Days.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Atividade Recente</h2>
        <div class="space-y-2">
          <DailyLogEntry
            v-for="log in dailyLogStore.last7Days.slice(0, 3)"
            :key="log.id"
            :entry="log"
            :compact="true"
          />
        </div>
      </div>

      <!-- Info Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-t border-gray-300 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Como usar?</h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>✓ Navegue pelos 16 módulos de Interpretação de Textos</li>
            <li>✓ Marque seus progressos tópico a tópico</li>
            <li>✓ Adicione materiais de estudo (YouTube, Drive, PDFs)</li>
            <li>✓ Acompanhe seu progresso no Dashboard</li>
            <li>✓ Registre seu estudo diário e mantenha o streak</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Estrutura</h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>📚 Módulo 1: Fundamentos da Leitura</li>
            <li>🔗 Módulo 7: Coesão Textual (Prioridade Máxima!)</li>
            <li>💭 Módulo 10: Inferência e Pressuposto</li>
            <li>🎨 Módulo 12: Figuras de Linguagem</li>
            <li>🏆 Módulo 16: Treino por Banca</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
