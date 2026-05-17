<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useAuthStore } from '@/stores/auth'
import AppNavBar from '@/components/templates/AppNavBar.vue'

const router = useRouter()
const dailyLogStore = useDailyLogStore()
const authStore = useAuthStore()

dailyLogStore.initLogs()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-light dark:bg-gray-900">
    <!-- Navigation Bar -->
    <AppNavBar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-[120rem] mx-auto w-full 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10">
        <RouterView />
      </div>
    </main>

    <!-- Desktop Sidebar Navigation (optional, not used in this layout) -->

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-gray-700 bg-light-secondary dark:bg-gray-800 mt-12 py-6">
      <div class="max-w-[120rem] mx-auto px-4 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10">
        <div class="space-y-6">
          <!-- Links Section -->
          <div class="flex flex-wrap justify-center items-center gap-6 text-sm">
            <button @click="router.push('/help')" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              Ajuda
            </button>
            <span class="text-slate-300 dark:text-gray-600">•</span>
            <button @click="router.push('/contatos')" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              Contatos
            </button>
            <span class="text-slate-300 dark:text-gray-600">•</span>
            <template v-if="authStore.isAdmin">
              <button @click="router.push('/changelog')" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                Changelog
              </button>
              <span class="text-slate-300 dark:text-gray-600">•</span>
            </template>
            <a href="https://github.com/maisondev/roadmap-web" target="_blank" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              GitHub
            </a>
          </div>

          <!-- Social Media & Email -->
          <div class="flex flex-wrap justify-center items-center gap-4">
            <a href="https://www.instagram.com/sinapses.site/" target="_blank" rel="noopener noreferrer" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" title="Instagram">
              📷
            </a>
            <a href="https://x.com/sinapsesite" target="_blank" rel="noopener noreferrer" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" title="Twitter/X">
              𝕏
            </a>
            <a href="mailto:hello@sinapses.site" class="text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" title="Email">
              ✉️
            </a>
          </div>

          <!-- Copyright -->
          <div class="text-center">
            <span class="text-xs text-slate-500 dark:text-gray-400">© 2026 Sinapses • hello@sinapses.site</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
