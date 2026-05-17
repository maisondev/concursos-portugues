<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SocialIcon from '@/components/atoms/SocialIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

interface FooterLink {
  label: string
  action: 'route' | 'link'
  target: string
  external?: boolean
}

const mainLinks: FooterLink[] = [
  { label: 'Ajuda', action: 'route', target: '/help' },
  { label: 'Contatos', action: 'route', target: '/contatos' },
  { label: 'GitHub', action: 'link', target: 'https://github.com/maisondev/roadmap-web', external: true }
]

const socialLinks = [
  { icon: 'instagram', url: 'https://www.instagram.com/sinapses.site/', label: 'Instagram' },
  { icon: 'twitter', url: 'https://x.com/sinapsesite', label: 'Twitter/X' },
  { icon: 'email', url: 'mailto:hello@sinapses.site', label: 'Email' }
]

const handleNavigation = (link: FooterLink) => {
  if (link.action === 'route') {
    router.push(link.target)
  } else {
    window.open(link.target, '_blank')
  }
}
</script>

<template>
  <footer class="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-12">
    <div class="max-w-[120rem] mx-auto px-4 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10 py-12">
      <div class="space-y-8">
        <!-- Main Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div class="flex flex-col space-y-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Sinapses
            </h3>
            <p class="text-sm text-slate-700 dark:text-slate-400">
              Organize seu aprendizado com roadmaps visuais
            </p>
          </div>

          <!-- Navigation Links -->
          <div class="flex flex-col space-y-3">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Links Úteis
            </h4>
            <nav class="space-y-2 flex flex-col">
              <button
                v-for="link in mainLinks"
                :key="link.target"
                @click="() => link.action === 'route' ? router.push(link.target) : window.open(link.target, '_blank')"
                :class="[
                  'text-sm text-slate-700 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left',
                  link.action === 'link' ? 'underline' : ''
                ]"
              >
                {{ link.label }}
              </button>
              <template v-if="authStore.isAdmin">
                <button
                  @click="router.push('/changelog')"
                  class="text-sm text-slate-700 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Changelog
                </button>
              </template>
            </nav>
          </div>

          <!-- Social Links -->
          <div class="flex flex-col space-y-3">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Redes Sociais
            </h4>
            <div class="flex gap-4">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.url"
                :title="social.label"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
              >
                <SocialIcon :icon="social.icon" :size="24" />
              </a>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-slate-300 dark:border-slate-700"></div>

        <!-- Footer Bottom -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 dark:text-slate-500">
          <span>© {{ new Date().getFullYear() }} Sinapses • hello@sinapses.site</span>
          <span>Desenvolvido com ❤️</span>
        </div>
      </div>
    </div>
  </footer>
</template>
