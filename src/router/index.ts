import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import RoadmapPage from '@/pages/RoadmapPage.vue'
import BlockDetailPage from '@/pages/BlockDetailPage.vue'
import TopicResourcesPage from '@/pages/TopicResourcesPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import ChangelogPage from '@/pages/ChangelogPage.vue'
import HelpPage from '@/pages/HelpPage.vue'

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
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
