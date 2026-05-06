<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useDailyLogStore } from '@/stores/dailyLog'
import AppButton from '@/components/atoms/AppButton.vue'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const dailyLogStore = useDailyLogStore()

const showBackButton = computed(() => {
  return route.name === 'block-detail' || route.name === 'roadmap'
})

const backLabel = computed(() => {
  if (route.name === 'block-detail') return 'Roadmap'
  if (route.name === 'roadmap') return 'Início'
  return ''
})

function goBack() {
  if (route.name === 'block-detail') {
    router.push({
      name: 'roadmap',
      params: { roadmapId: route.params.roadmapId }
    })
  } else if (route.name === 'roadmap') {
    router.push('/')
  }
}

function navigateTo(path: string, name: string) {
  router.push({
    name,
    params: path === '/roadmap' ? { roadmapId: 'interpretacao-textos' } : undefined
  })
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

const navItems = [
  { name: 'home', path: '/', label: 'Início', icon: '🏠' },
  { name: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { name: 'settings', path: '/settings', label: 'Configurações', icon: '⚙️' }
]

const isActive = (name: string) => route.name === name
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Main navbar -->
      <div class="flex items-center justify-between h-16">
        <!-- Left section: back button + logo -->
        <div class="flex items-center gap-4">
          <!-- Back button -->
          <Transition name="fade">
            <button
              v-if="showBackButton"
              @click="goBack"
              class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ← {{ backLabel }}
            </button>
          </Transition>

          <!-- Logo -->
          <div
            @click="router.push('/')"
            class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span class="text-2xl">📚</span>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white hidden sm:block whitespace-nowrap">
              Concursos Português
            </h1>
          </div>
        </div>

        <!-- Center section: desktop navigation -->
        <div class="hidden md:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.name"
            @click="navigateTo(item.path, item.name)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.name)
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ item.icon }} {{ item.label }}
          </button>
        </div>

        <!-- Right section: streak + theme toggle -->
        <div class="flex items-center gap-3">
          <!-- Streak counter -->
          <div
            v-if="dailyLogStore.streakDays > 0"
            class="flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-950"
          >
            <span class="text-lg">🔥</span>
            <span class="text-sm font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
              {{ dailyLogStore.streakDays }}
            </span>
          </div>

          <!-- Theme toggle -->
          <AppButton
            variant="ghost"
            size="sm"
            @click="toggleTheme"
            class="px-2"
          >
            {{ settingsStore.settings.theme === 'dark' ? '☀️' : '🌙' }}
          </AppButton>

          <!-- Mobile menu button -->
          <button
            class="md:hidden px-2 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="router.push('/')"
          >
            ☰
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <div
        v-show="route.name !== 'home' && route.name !== 'block-detail' && route.name !== 'roadmap'"
        class="md:hidden border-t border-gray-300 dark:border-gray-700 px-2 py-2 flex gap-1 overflow-x-auto"
      >
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="navigateTo(item.path, item.name)"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            isActive(item.name)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ item.icon }} {{ item.label }}
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
