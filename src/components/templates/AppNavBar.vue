<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useDailyLogStore } from '@/stores/dailyLog'
import { ArrowLeftIcon, HomeIcon, ChartBarIcon, Cog6ToothIcon, SunIcon, MoonIcon, Bars3Icon } from '@heroicons/vue/24/outline'
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
  { name: 'home', path: '/', label: 'Início', icon: HomeIcon },
  { name: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { name: 'settings', path: '/settings', label: 'Configurações', icon: Cog6ToothIcon }
]

const isActive = (name: string) => route.name === name
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
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
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              {{ backLabel }}
            </button>
          </Transition>

          <!-- Logo -->
          <div
            @click="router.push('/')"
            class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity -ml-1"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              CP
            </div>
            <h1 class="text-base font-bold text-gray-900 dark:text-white hidden sm:block whitespace-nowrap">
              Concursos
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
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.name)
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </button>
        </div>

        <!-- Right section: streak + theme toggle -->
        <div class="flex items-center gap-3">
          <!-- Streak counter -->
          <div
            v-if="dailyLogStore.streakDays > 0"
            class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/30"
          >
            <div class="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {{ dailyLogStore.streakDays }}
            </div>
            <span class="text-xs font-semibold text-orange-700 dark:text-orange-300 whitespace-nowrap">
              dias
            </span>
          </div>

          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :title="settingsStore.settings.theme === 'dark' ? 'Modo claro' : 'Modo escuro'"
          >
            <SunIcon v-if="settingsStore.settings.theme === 'dark'" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="router.push('/')"
          >
            <Bars3Icon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <div
        v-show="route.name !== 'home' && route.name !== 'block-detail' && route.name !== 'roadmap'"
        class="md:hidden border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex gap-1 overflow-x-auto"
      >
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="navigateTo(item.path, item.name)"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            isActive(item.name)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
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
