import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: Date
  read: boolean
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  const sortedNotifications = computed(() => {
    return notifications.value.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  })

  function addNotification(title: string, message: string, type: NotificationType = 'info', duration?: number) {
    const id = Date.now().toString()
    const notification: Notification = {
      id,
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    }

    notifications.value.unshift(notification)

    // Auto remove after duration if specified
    if (duration) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function markAsRead(id: string) {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) {
      notif.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => {
      n.read = true
    })
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications,
    unreadCount,
    sortedNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
})
