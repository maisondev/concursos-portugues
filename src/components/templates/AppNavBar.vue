<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useAuthStore } from '@/stores/auth'
import { useSync } from '@/composables/useSync'
import { useGlobalLoading } from '@/composables/useGlobalLoading'
import { ArrowLeftIcon, HomeIcon, Cog6ToothIcon, SunIcon, MoonIcon, Bars3Icon, MapIcon, ChartBarIcon, ShieldCheckIcon, ChatBubbleLeftEllipsisIcon, EyeIcon, EyeSlashIcon, ArrowRightOnRectangleIcon, BellIcon, XMarkIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/atoms/AppButton.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import FeedbackModal from '@/components/molecules/FeedbackModal.vue'
import { useNotificationsStore } from '@/stores/notifications'
import MD5 from 'crypto-js/md5'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const dailyLogStore = useDailyLogStore()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const { syncStatus, isSyncing } = useSync()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const fullName = ref('')
const authError = ref<string | null>(null)
const showFeedbackModal = ref(false)
const showMobileMenu = ref(false)
const showPassword = ref(false)
const showProfileMenu = ref(false)
const showNotificationsMenu = ref(false)

function getGravatarUrl(userEmail: string): string {
  const emailLower = userEmail.toLowerCase().trim()
  const hash = MD5(emailLower).toString()
  return `https://www.gravatar.com/avatar/${hash}?s=40&d=identicon`
}

const profileAvatarUrl = computed(() => {
  if (authStore.user?.avatar) return authStore.user.avatar
  return getGravatarUrl(authStore.userEmail || '')
})

function getNotificationColor(type: string) {
  const colors = {
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return colors[type as keyof typeof colors] || colors.info
}

function getNotificationBorderColor(type: string) {
  const colors = {
    info: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    error: 'border-l-red-500'
  }
  return colors[type as keyof typeof colors] || colors.info
}

function openLogin() {
  authMode.value = 'login'
  email.value = ''
  password.value = ''
  fullName.value = ''
  authError.value = null
  showPassword.value = false
  showAuthModal.value = true
}

function openRegister() {
  authMode.value = 'register'
  email.value = ''
  password.value = ''
  fullName.value = ''
  authError.value = null
  showPassword.value = false
  showAuthModal.value = true
}

async function submitAuth() {
  authError.value = null
  try {
    if (authMode.value === 'register') {
      await withLoading(
        authStore.register(email.value, password.value, fullName.value),
        'Criando sua conta...'
      )
    } else {
      await withLoading(
        authStore.login(email.value, password.value),
        'Entrando...'
      )
    }
    showAuthModal.value = false
  } catch (e) {
    authError.value = e instanceof Error ? e.message : String(e)
  }
}

const { withLoading } = useGlobalLoading()

const showBackButton = computed(() => {
  // Mostrar em páginas detalhadas quando logado
  if (route.name === 'block-detail') return true
  // Mostrar em páginas públicas quando não logado
  if (!authStore.isLoggedIn && ['contact', 'help'].includes(route.name as string)) return true
  return false
})

const backLabel = computed(() => {
  if (route.name === 'block-detail') return 'Roadmap'
  if (route.name === 'contact' || route.name === 'help') return 'Voltar'
  return ''
})

function goBack() {
  if (route.name === 'block-detail') {
    router.push({
      name: 'roadmap',
      params: { roadmapId: route.params.roadmapId }
    })
  } else if (route.name === 'contact' || route.name === 'help') {
    router.push('/')
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
    { name: 'daily-log', path: '/daily-log', label: 'Registros', icon: CalendarIcon }
  ]
  if (authStore.isAdmin) {
    items.push({ name: 'admin', path: '/admin', label: 'Admin', icon: ShieldCheckIcon })
  }
  return items
})

const isActive = (name: string) => route.name === name
</script>

<template>
  <nav :class="[`sticky top-0 z-50`, authStore.isLoggedIn ? `bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 shadow-sm` : `bg-slate-950 border-b border-slate-800/60`]">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Main navbar -->
      <div class="flex items-center justify-between h-16">
        <!-- Left section: logo or back button -->
        <div class="flex items-center gap-3 min-w-0 flex-shrink-0">
          <!-- Logo (always shown) -->
          <button
            @click="router.push('/')"
            class="py-1 px-1 rounded-lg hover:opacity-75 transition-opacity focus:outline-none flex-shrink-0"
            title="Voltar para home"
          >
            <img src="@/assets/sinapses-logo.png" alt="Sinapses" class="h-16 sm:h-16 md:h-20 w-auto object-contain" />
          </button>

        </div>

        <!-- Center section: public links (not logged in) -->
        <div v-if="!authStore.isLoggedIn" class="hidden md:flex items-center gap-8">
          <button @click="router.push('/')" class="text-slate-300 hover:text-white text-sm transition-colors">Início</button>
          <button @click="router.push('/help')" class="text-slate-300 hover:text-white text-sm transition-colors">Ajuda</button>
          <button @click="router.push('/contact')" class="text-slate-300 hover:text-white text-sm transition-colors">Contato</button>
        </div>

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
        <div class="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
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

          <!-- Notifications button -->
          <div v-if="authStore.isLoggedIn" class="relative">
            <button
              @click="showNotificationsMenu = !showNotificationsMenu"
              class="relative p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Notificações"
            >
              <BellIcon class="w-5 h-5" />
              <span
                v-if="notificationsStore.unreadCount > 0"
                class="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
              >
                {{ notificationsStore.unreadCount }}
              </span>
            </button>

            <!-- Notifications dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showNotificationsMenu"
                class="absolute -right-4 mt-2 w-[28rem] max-h-[48rem] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <!-- Header -->
                <div class="sticky top-0 flex items-center justify-between bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">Notificações</h3>
                    <span v-if="notificationsStore.unreadCount > 0" class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                      {{ notificationsStore.unreadCount }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="notificationsStore.unreadCount > 0"
                      @click="notificationsStore.markAllAsReadSync()"
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Marcar tudo
                    </button>
                    <button
                      @click="router.push('/notifications'); showNotificationsMenu = false"
                      class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      title="Ver todas as notificações"
                    >
                      Ver todas →
                    </button>
                  </div>
                </div>

                <!-- Notifications list -->
                <div v-if="notificationsStore.sortedNotifications.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
                  <div
                    v-for="notif in notificationsStore.sortedNotifications"
                    :key="notif.id"
                    :class="[
                      'border-l-4 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50',
                      getNotificationBorderColor(notif.type),
                      notif.read
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-blue-50 dark:bg-blue-900/20'
                    ]"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex-1 min-w-0 cursor-pointer" @click="notificationsStore.markAsReadSync(notif.id)">
                        <p class="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
                          {{ notif.title }}
                        </p>
                        <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap break-words leading-relaxed">
                          {{ notif.message }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2.5">
                          {{ new Date(notif.timestamp).toLocaleString('pt-BR') }}
                        </p>
                      </div>
                      <div class="flex items-center gap-1 flex-shrink-0">
                        <button
                          @click.stop="notificationsStore.toggleReadSync(notif.id)"
                          class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          :title="notif.read ? 'Marcar como não lido' : 'Marcar como lido'"
                        >
                          <span v-if="!notif.read" class="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span>
                          <span v-else class="w-2.5 h-2.5 bg-gray-400 rounded-full inline-block"></span>
                        </button>
                        <button
                          @click.stop="notificationsStore.removeNotificationSync(notif.id)"
                          class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <XMarkIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty state -->
                <div v-else class="p-8 text-center">
                  <BellIcon class="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Nenhuma notificação no momento
                  </p>
                </div>
              </div>
            </Transition>

            <!-- Close dropdown on outside click -->
            <div
              v-if="showNotificationsMenu"
              @click="showNotificationsMenu = false"
              class="fixed inset-0 z-40"
            />
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

          <!-- Settings button -->
          <button
            v-if="authStore.isLoggedIn"
            @click="router.push('/settings')"
            class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Configurações"
          >
            <Cog6ToothIcon class="w-5 h-5" />
          </button>

          <!-- User area -->
          <div v-if="!authStore.isLoggedIn" class="flex items-center gap-3">
            <AppButton
              variant="secondary"
              size="sm"
              @click="openLogin"
              class="hidden sm:inline-flex"
            >
              Entrar
            </AppButton>
            <AppButton
              variant="primary"
              size="md"
              @click="openRegister"
              class="inline-flex"
            >
              Criar conta grátis
            </AppButton>
          </div>
            <div v-else class="relative">
              <!-- Profile button -->
              <button
                @click="showProfileMenu = !showProfileMenu"
                class="flex items-center gap-2 px-2.5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                  class="absolute -right-2 sm:-right-4 mt-2 w-72 sm:w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <!-- Profile header -->
                  <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4">
                    <div class="flex items-start gap-2 sm:gap-3">
                      <img
                        :src="profileAvatarUrl"
                        :alt="authStore.user?.name || 'Usuário'"
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-white font-semibold text-xs sm:text-sm whitespace-normal break-words">
                          {{ authStore.user?.name || 'Usuário' }}
                        </p>
                        <p class="text-blue-100 text-xs truncate">
                          {{ authStore.userEmail }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Menu items -->
                  <div class="py-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      @click="handleLogout(); showProfileMenu = false"
                      class="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <ArrowRightOnRectangleIcon class="w-4 h-4 flex-shrink-0" />
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

          <!-- Mobile menu button -->
          <button
            v-if="authStore.isLoggedIn"
            class="md:hidden p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="showMobileMenu = !showMobileMenu"
          >
            <Bars3Icon class="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>

    <!-- Mobile Navigation Drawer -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="authStore.isLoggedIn && showMobileMenu"
          @click="showMobileMenu = false"
          class="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden"
        />
      </Transition>

      <!-- Drawer -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="authStore.isLoggedIn && showMobileMenu"
          class="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-lg z-50 md:hidden flex flex-col"
        >
          <!-- Drawer Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
            <button
              @click="showMobileMenu = false"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            <!-- Navigation Items -->
            <button
              v-for="item in navItems"
              :key="item.name"
              @click="navigateTo(item.path, item.name)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                isActive(item.name)
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span>{{ item.label }}</span>
            </button>

            <!-- Divider -->
            <div class="h-px bg-gray-200 dark:bg-gray-700 my-4" />

            <!-- Theme Toggle in Drawer -->
            <button
              @click="toggleTheme; showMobileMenu = false"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SunIcon v-if="settingsStore.settings.theme === 'dark'" class="w-5 h-5 flex-shrink-0" />
              <MoonIcon v-else class="w-5 h-5 flex-shrink-0" />
              <span>{{ settingsStore.settings.theme === 'dark' ? 'Modo claro' : 'Modo escuro' }}</span>
            </button>
          </div>

          <!-- Drawer Footer -->
          <div class="border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              @click="handleLogout; showMobileMenu = false"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5 flex-shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <AppModal
      :open="showAuthModal"
      :title="authMode === 'register' ? 'Criar conta' : 'Entrar'"
      submit-label="Continuar"
      cancel-label="Cancelar"
      @submit="submitAuth"
      @cancel="showAuthModal = false"
    >
      <div class="space-y-5 sm:space-y-4">
        <div v-if="authMode === 'register'">
          <label class="block text-sm sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome completo
          </label>
          <input
            v-model="fullName"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label class="block text-sm sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-mail
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
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
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base"
              :placeholder="authMode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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







