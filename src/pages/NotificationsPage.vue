<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import { BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const notificationsStore = useNotificationsStore()

const filterType = ref<'all' | 'info' | 'success' | 'warning' | 'error'>('all')
const filterRead = ref<'all' | 'read' | 'unread'>('all')

const filteredNotifications = computed(() => {
  return notificationsStore.sortedNotifications.filter(notif => {
    if (filterType.value !== 'all' && notif.type !== filterType.value) return false
    if (filterRead.value === 'read' && !notif.read) return false
    if (filterRead.value === 'unread' && notif.read) return false
    return true
  })
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

function getNotificationTypeLabel(type: string) {
  const labels = {
    info: 'Informação',
    success: 'Sucesso',
    warning: 'Aviso',
    error: 'Erro'
  }
  return labels[type as keyof typeof labels] || 'Info'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <BellIcon class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Notificações
          </h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ notificationsStore.unreadCount }} não lida(s) de {{ notificationsStore.notifications.length }} total
        </p>
      </div>

      <!-- Actions -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <button
          v-if="notificationsStore.unreadCount > 0"
          @click="notificationsStore.markAllAsReadSync()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Marcar tudo como lido
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Filtros
        </h3>
        <div class="flex flex-wrap gap-2">
          <!-- Type filter -->
          <div class="flex gap-1">
            <button
              v-for="type in ['all', 'info', 'success', 'warning', 'error']"
              :key="`type-${type}`"
              @click="filterType = type as any"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ type === 'all' ? 'Todos' : getNotificationTypeLabel(type) }}
            </button>
          </div>

          <!-- Read filter -->
          <div class="flex gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
            <button
              v-for="status in ['all', 'read', 'unread']"
              :key="`read-${status}`"
              @click="filterRead = status as any"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                filterRead === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ status === 'all' ? 'Todos' : (status === 'read' ? 'Lidas' : 'Não lidas') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications list -->
      <div v-if="filteredNotifications.length > 0" class="space-y-4">
        <div
          v-for="notif in filteredNotifications"
          :key="notif.id"
          :class="[
            'border-l-4 p-6 rounded-lg bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all hover:shadow-md',
            getNotificationBorderColor(notif.type),
            notif.read
              ? 'opacity-85'
              : 'ring-1 ring-blue-500 ring-opacity-50 shadow-sm'
          ]"
        >
          <div class="flex items-start gap-4">
            <!-- Type badge -->
            <div
              :class="[
                'px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0',
                getNotificationColor(notif.type)
              ]"
            >
              {{ getNotificationTypeLabel(notif.type) }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white leading-snug">
                {{ notif.title }}
              </h3>
              <p class="text-base text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-wrap break-words leading-relaxed">
                {{ notif.message }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-3.5">
                {{ new Date(notif.timestamp).toLocaleString('pt-BR') }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="notificationsStore.toggleReadSync(notif.id)"
                :class="[
                  'p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  notif.read
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-blue-600 dark:text-blue-400'
                ]"
                :title="notif.read ? 'Marcar como não lido' : 'Marcar como lido'"
              >
                <span
                  :class="[
                    'inline-block rounded-full',
                    notif.read ? 'w-2.5 h-2.5 bg-gray-400' : 'w-2.5 h-2.5 bg-blue-600'
                  ]"
                />
              </button>
              <button
                @click="notificationsStore.removeNotificationSync(notif.id)"
                class="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Remover"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="py-12 text-center">
        <BellIcon class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Nenhuma notificação encontrada
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          {{ filterType !== 'all' || filterRead !== 'all' ? 'Tente ajustar os filtros' : 'Você está em dia!' }}
        </p>
      </div>
    </div>
  </div>
</template>
