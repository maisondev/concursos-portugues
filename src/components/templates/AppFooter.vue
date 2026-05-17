<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SocialIcon from '@/components/atoms/SocialIcon.vue'
import sinapsesLogo from '@/assets/sinapses-logo.png'

const router = useRouter()
const authStore = useAuthStore()

const socialLinks = [
  { icon: 'instagram', url: 'https://www.instagram.com/sinapses.site/', label: 'Instagram' },
  { icon: 'twitter', url: 'https://x.com/sinapsesite', label: 'Twitter/X' },
  { icon: 'email', url: 'mailto:sinapses.site@gmail.com', label: 'Email' }
]

const footerLinks = [
  {
    title: 'Produto',
    links: [
      { label: 'Roadmaps', action: () => router.push('/') },
      { label: 'Dashboard', action: () => router.push('/dashboard') },
      { label: 'Registros', action: () => router.push('/dashboard') }
    ]
  },
  {
    title: 'Empresa',
    links: [
      { label: 'GitHub', action: () => window.open('https://github.com/maisondev', '_blank') },
      { label: 'Site', action: () => window.open('https://sinapses.site', '_blank') },
      { label: 'Contato', action: () => router.push('/contact') }
    ]
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Ajuda', action: () => router.push('/help') },
      { label: 'Blog', action: () => {} },
      { label: 'Changelog', action: () => router.push('/changelog') }
    ]
  }
]
</script>

<template>
  <footer class="bg-slate-950 border-t border-slate-800/60 mt-8 sm:mt-12">
    <div class="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
      <!-- Footer Content -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
          <button
            @click="router.push('/')"
            class="hover:opacity-80 transition-opacity"
          >
            <img :src="sinapsesLogo" alt="Sinapses" class="h-24 sm:h-32 md:h-40 w-auto object-contain" />
          </button>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Organize seu aprendizado em roadmaps visuais. Fortaleça suas conexões de conhecimento.
          </p>
          <div class="flex gap-2 sm:gap-3 pt-1">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              :title="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-violet-900/40 transition-all"
            >
              <SocialIcon :icon="social.icon" :size="16" />
            </a>
          </div>
        </div>

        <!-- Footer Links -->
        <div
          v-for="(section, idx) in footerLinks"
          :key="idx"
          class="space-y-3 sm:space-y-4"
        >
          <h4 class="text-xs sm:text-sm font-semibold text-white">{{ section.title }}</h4>
          <ul class="space-y-1.5 sm:space-y-2">
            <li v-for="link in section.links" :key="link.label">
              <button
                @click="link.action()"
                class="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors text-left"
              >
                {{ link.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-slate-800 pt-6 sm:pt-8">
        <div class="flex flex-col items-center sm:items-center sm:justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p class="text-xs sm:text-sm text-slate-500">
            © {{ new Date().getFullYear() }} Sinapses. Todos os direitos reservados.
          </p>
          <div class="flex gap-4 sm:gap-6">
            <router-link to="/privacidade" class="text-xs sm:text-sm text-slate-500 hover:text-white transition-colors">
              Privacidade
            </router-link>
            <router-link to="/termos" class="text-xs sm:text-sm text-slate-500 hover:text-white transition-colors">
              Termos
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
