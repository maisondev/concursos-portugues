<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useAuthStore } from '@/stores/auth'
import { useRoadmapStore } from '@/stores/roadmap'
import AppNavBar from '@/components/templates/AppNavBar.vue'
import AppFooter from '@/components/templates/AppFooter.vue'
import AppBreadcrumb from '@/components/atoms/AppBreadcrumb.vue'
import ConsentModal from '@/components/molecules/ConsentModal.vue'

const dailyLogStore = useDailyLogStore()
const authStore = useAuthStore()
const roadmapStore = useRoadmapStore()
const route = useRoute()
const router = useRouter()

dailyLogStore.initLogs()

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  settings: 'Configurações',
  notifications: 'Notificações',
  admin: 'Admin',
  changelog: 'Changelog',
  help: 'Ajuda',
  contact: 'Contato',
  'daily-log': 'Registros Diários',
}

const breadcrumbs = computed(() => {
  if (!authStore.isLoggedIn) return []

  const name = route.name as string
  if (!name || name === 'home') return []

  const home = { label: 'Início', action: () => router.push('/') }

  if (name === 'roadmap') {
    const roadmapId = route.params.roadmapId as string
    const roadmap = roadmapStore.roadmaps[roadmapId]
    return [home, { label: roadmap?.title || 'Roadmap' }]
  }

  if (name === 'block-detail') {
    const roadmapId = route.params.roadmapId as string
    const blockId = route.params.blockId as string
    const roadmap = roadmapStore.roadmaps[roadmapId]
    const block = roadmap?.blocks.find(b => b.id === blockId)
    return [
      home,
      {
        label: roadmap?.title || 'Roadmap',
        action: () => router.push({ name: 'roadmap', params: { roadmapId } })
      },
      { label: block?.title || 'Bloco' }
    ]
  }

  if (name === 'topic-resources') {
    const roadmapId = route.params.roadmapId as string
    const blockId = route.params.blockId as string
    const topicId = route.params.topicId as string
    const roadmap = roadmapStore.roadmaps[roadmapId]
    const block = roadmap?.blocks.find(b => b.id === blockId)
    const topic = block?.topics.find(t => t.id === topicId)
    return [
      home,
      {
        label: roadmap?.title || 'Roadmap',
        action: () => router.push({ name: 'roadmap', params: { roadmapId } })
      },
      {
        label: block?.title || 'Bloco',
        action: () => router.push({ name: 'block-detail', params: { roadmapId, blockId } })
      },
      { label: topic?.title || 'Tópico' }
    ]
  }

  const label = routeLabels[name]
  if (label) return [home, { label }]

  return []
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-light dark:bg-gray-900">
    <!-- Navigation Bar -->
    <AppNavBar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-[120rem] mx-auto w-full 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10">
        <div v-if="breadcrumbs.length" class="px-4 pt-4 2xl:px-8">
          <AppBreadcrumb :crumbs="breadcrumbs" />
        </div>
        <RouterView />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Modal de re-consentimento LGPD para usuários existentes -->
    <ConsentModal />
  </div>
</template>
