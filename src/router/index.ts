import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import RoadmapPage from '@/pages/RoadmapPage.vue'
import BlockDetailPage from '@/pages/BlockDetailPage.vue'
import TopicResourcesPage from '@/pages/TopicResourcesPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import DailyLogPage from '@/pages/DailyLogPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import NotificationsPage from '@/pages/NotificationsPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import ChangelogPage from '@/pages/ChangelogPage.vue'
import HelpPage from '@/pages/HelpPage.vue'
import ContactPage from '@/pages/ContactPage.vue'
import PrivacyPage from '@/pages/PrivacyPage.vue'
import TermsPage from '@/pages/TermsPage.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/roadmap/:roadmapId',
    name: 'roadmap',
    component: RoadmapPage,
    props: true
  },
  {
    path: '/roadmap/:roadmapId/bloco/:blockId',
    name: 'block-detail',
    component: BlockDetailPage,
    props: true
  },
  {
    path: '/roadmap/:roadmapId/bloco/:blockId/topico/:topicId',
    name: 'topic-resources',
    component: TopicResourcesPage,
    props: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage
  },
  {
    path: '/changelog',
    name: 'changelog',
    component: ChangelogPage
  },
  {
    path: '/help',
    name: 'help',
    component: HelpPage
  },
  {
    path: '/contatos',
    name: 'contact',
    component: ContactPage
  },
  {
    path: '/daily-log',
    name: 'daily-log',
    component: DailyLogPage
  },
  {
    path: '/privacidade',
    name: 'privacy',
    component: PrivacyPage
  },
  {
    path: '/termos',
    name: 'terms',
    component: TermsPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// Guard para proteger rotas /admin e /changelog (apenas para admins e owners)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.name === 'admin' || to.name === 'changelog') {
    if (!authStore.isAdmin) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
