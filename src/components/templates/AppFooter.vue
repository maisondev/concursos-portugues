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
  <footer class="bg-slate-950 border-t border-slate-800/60 mt-12">
    <div class="max-w-6xl mx-auto px-4 py-16">
      <!-- Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="space-y-4">
          <button
            @click="router.push('/')"
            class="hover:opacity-80 transition-opacity"
          >
            <img :src="sinapsesLogo" alt="Sinapses" class="h-40 w-auto object-contain" />
          </button>
          <p class="text-sm text-slate-400 leading-relaxed">
            Organize seu aprendizado em roadmaps visuais. Fortaleça suas conexões de conhecimento.
          </p>
          <div class="flex gap-3 pt-1">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              :title="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-violet-900/40 transition-all"
            >
              <SocialIcon :icon="social.icon" :size="18" />
            </a>
          </div>
        </div>

        <!-- Footer Links -->
        <div
          v-for="(section, idx) in footerLinks"
          :key="idx"
          class="space-y-4"
        >
          <h4 class="text-sm font-semibold text-white">{{ section.title }}</h4>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.label">
              <button
                @click="link.action()"
                class="text-sm text-slate-400 hover:text-white transition-colors text-left"
              >
                {{ link.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-slate-800 pt-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-slate-500">
            © {{ new Date().getFullYear() }} Sinapses. Todos os direitos reservados.
          </p>
          <div class="flex gap-4">
            <button class="text-sm text-slate-500 hover:text-white transition-colors">
              Privacidade
            </button>
            <button class="text-sm text-slate-500 hover:text-white transition-colors">
              Termos
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
