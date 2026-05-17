<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useAuthStore } from '@/stores/auth'
import { useSync } from '@/composables/useSync'
import { ArrowLeftIcon, HomeIcon, Cog6ToothIcon, SunIcon, MoonIcon, Bars3Icon, MapIcon, ChartBarIcon, ShieldCheckIcon, ChatBubbleLeftEllipsisIcon, EyeIcon, EyeSlashIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/atoms/AppButton.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import FeedbackModal from '@/components/molecules/FeedbackModal.vue'
import MD5 from 'crypto-js/md5'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const dailyLogStore = useDailyLogStore()
const authStore = useAuthStore()
const { syncStatus, isSyncing } = useSync()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const authError = ref<string | null>(null)
const showFeedbackModal = ref(false)
const showMobileMenu = ref(false)
const showPassword = ref(false)
const showProfileMenu = ref(false)

function getGravatarUrl(userEmail: string): string {
  const emailLower = userEmail.toLowerCase().trim()
  const hash = MD5(emailLower).toString()
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}

const profileAvatarUrl = computed(() => {
  if (authStore.user?.avatar) return authStore.user.avatar
  return getGravatarUrl(authStore.userEmail || '')
})

function openLogin() {
  authMode.value = 'login'
  email.value = ''
  password.value = ''
  authError.value = null
  showPassword.value = false
  showAuthModal.value = true
}

function openRegister() {
  authMode.value = 'register'
  email.value = ''
  password.value = ''
  authError.value = null
  showPassword.value = false
  showAuthModal.value = true
}

async function submitAuth() {
  authError.value = null
  try {
    if (authMode.value === 'register') {
      await authStore.register(email.value, password.value)
    } else {
      await authStore.login(email.value, password.value)
    }
    showAuthModal.value = false
  } catch (e) {
    authError.value = e instanceof Error ? e.message : String(e)
  }
}

const showBackButton = computed(() => {
  return route.name === 'block-detail'
})

const backLabel = computed(() => {
  if (route.name === 'block-detail') return 'Roadmap'
  return ''
})

function goBack() {
  if (route.name === 'block-detail') {
    router.push({
      name: 'roadmap',
      params: { roadmapId: route.params.roadmapId }
    })
  }
}

function navigateTo(path: string, name: string) {
  router.push({
    name,
    params: path === '/roadmap' ? { roadmapId: 'interpretacao-textos' } : undefined
  })
  showMobileMenu.value = false
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

const navItems = computed(() => {
  const items = [
    { name: 'home', path: '/', label: 'Roadmaps', icon: HomeIcon },
    { name: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { name: 'settings', path: '/settings', label: 'Configurações', icon: Cog6ToothIcon }
  ]
  if (authStore.isAdmin) {
    items.push({ name: 'admin', path: '/admin', label: 'Admin', icon: ShieldCheckIcon })
  }
  return items
})

const isActive = (name: string) => route.name === name
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 shadow-sm">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Main navbar -->
      <div class="flex items-center justify-between h-16">
        <!-- Left section: back button (only shown when needed) -->
        <Transition name="fade">
          <div v-if="showBackButton" class="flex items-center gap-4">
            <button
              @click="goBack"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              {{ backLabel }}
            </button>
          </div>
        </Transition>

        <!-- Center section: desktop navigation (only when logged in) -->
        <div v-if="authStore.isLoggedIn" class="hidden md:flex items-center gap-1 flex-1 justify-center">
          <button
            v-for="item in navItems"
            :key="item.name"
            @click="navigateTo(item.path, item.name)"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.name)
                ? 'bg-primary text-white'
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

          <!-- Feedback button -->
          <button
            @click="showFeedbackModal = true"
            class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Enviar Feedback"
          >
            <ChatBubbleLeftEllipsisIcon class="w-5 h-5" />
          </button>

          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :title="settingsStore.settings.theme === 'dark' ? 'Modo claro' : 'Modo escuro'"
          >
            <SunIcon v-if="settingsStore.settings.theme === 'dark'" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- User area -->
          <div class="hidden sm:flex items-center gap-2">
            <div v-if="!authStore.isLoggedIn" class="flex gap-2">
              <AppButton
                variant="secondary"
                size="sm"
                @click="openLogin"
              >
                Entrar
              </AppButton>
              <AppButton
                variant="primary"
                size="sm"
                @click="openRegister"
              >
                Cadastro
              </AppButton>
            </div>
            <div v-else class="relative">
              <!-- Profile button -->
              <button
                @click="showProfileMenu = !showProfileMenu"
                class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  :src="profileAvatarUrl"
                  :alt="authStore.username"
                  class="w-8 h-8 rounded-full"
                />
              </button>

              <!-- Dropdown menu -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showProfileMenu"
                  class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <!-- Profile header -->
                  <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <div class="flex items-start gap-3">
                      <img
                        :src="profileAvatarUrl"
                        :alt="authStore.username"
                        class="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-white font-semibold text-sm truncate">
                          {{ authStore.username || 'Usuário' }}
                        </p>
                        <p class="text-blue-100 text-xs truncate">
                          {{ authStore.userEmail }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Menu items -->
                  <div class="py-1 border-t border-gray-200 dark:border-gray-700">
                    <button
                      @click="router.push('/settings'); showProfileMenu = false"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      ⚙️ Configurações
                    </button>
                    <button
                      @click="handleLogout(); showProfileMenu = false"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <ArrowRightOnRectangleIcon class="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              </Transition>

              <!-- Close dropdown on outside click -->
              <div
                v-if="showProfileMenu"
                @click="showProfileMenu = false"
                class="fixed inset-0 z-40"
              />
            </div>
          </div>

          <!-- Mobile menu button -->
          <button
            v-if="authStore.isLoggedIn"
            class="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="showMobileMenu = !showMobileMenu"
          >
            <Bars3Icon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile navigation (only when logged in) -->
      <div
        v-if="authStore.isLoggedIn && showMobileMenu"
        class="md:hidden border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex flex-col gap-1"
      >
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="navigateTo(item.path, item.name)"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            isActive(item.name)
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </button>
      </div>
    </div>

    <AppModal
      :open="showAuthModal"
      :title="authMode === 'register' ? 'Criar conta' : 'Entrar'"
      submit-label="Continuar"
      cancel-label="Cancelar"
      @submit="submitAuth"
      @cancel="showAuthModal = false"
    >
      <div class="space-y-5 sm:space-y-4">
        <div>
          <label class="block text-sm sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-mail
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-3 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
            :placeholder="authMode === 'register' ? 'seu@email.com' : 'seu@email.com'"
          />
        </div>

        <div>
          <label class="block text-sm sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Senha
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-3 sm:px-3 sm:py-2 pr-12 sm:pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
              :placeholder="authMode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <EyeIcon v-if="showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <p v-if="authError" class="text-sm text-red-600 dark:text-red-400">
          {{ authError }}
        </p>

        <button
          type="button"
          class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          @click="authMode = authMode === 'login' ? 'register' : 'login'; authError = null"
        >
          {{ authMode === 'login' ? 'Criar conta' : 'Já tenho conta' }}
        </button>
      </div>
    </AppModal>

    <FeedbackModal
      :open="showFeedbackModal"
      @close="showFeedbackModal = false"
    />
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
