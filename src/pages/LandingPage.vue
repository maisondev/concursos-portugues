<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppButton from '@/components/atoms/AppButton.vue'
import BenefitIcon from '@/components/atoms/BenefitIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('register')
const email = ref('')
const password = ref('')
const consentGiven = ref(false)
const authError = ref<string | null>(null)
const isSubmitting = ref(false)

const benefits = [
  {
    icon: 'layers',
    title: 'Roadmaps como Redes',
    description: 'Crie roadmaps estruturados em blocos e tópicos para mapear suas conexões de conhecimento'
  },
  {
    icon: 'chart',
    title: 'Visualize seu Progresso',
    description: 'Acompanhe em tempo real o fortalecimento de suas sinapses de aprendizado'
  },
  {
    icon: 'notebook',
    title: 'Registros Diários',
    description: 'Consolide seu aprendizado com registros diários e acompanhe sua dedicação'
  },
  {
    icon: 'star',
    title: 'Mapeie suas Fontes',
    description: 'Crie rankings de professores para identificar suas melhores fontes de conhecimento'
  },
  {
    icon: 'cloud',
    title: 'Estude sem Limites',
    description: 'Funciona offline — suas mudanças sincronizam automaticamente quando conectado'
  },
  {
    icon: 'shield',
    title: 'Adequado à LGPD',
    description: 'Seus dados protegidos por lei. Consentimento explícito, exportação de dados, exclusão de conta e Política de Privacidade completa — tudo conforme a Lei nº 13.709/2018.'
  }
]

function openRegister() {
  authMode.value = 'register'
  email.value = ''
  password.value = ''
  consentGiven.value = false
  authError.value = null
  showAuthModal.value = true
}

function openLogin() {
  authMode.value = 'login'
  email.value = ''
  password.value = ''
  consentGiven.value = false
  authError.value = null
  showAuthModal.value = true
}

async function submitAuth() {
  authError.value = null
  isSubmitting.value = true

  try {
    if (authMode.value === 'register') {
      await authStore.register(email.value, password.value, undefined, consentGiven.value)
    } else {
      await authStore.login(email.value, password.value)
    }

    showAuthModal.value = false
    router.push('/dashboard')
  } catch (e) {
    authError.value = e instanceof Error ? e.message : String(e)
  } finally {
    isSubmitting.value = false
  }
}

const footerLinks = [
  {
    title: 'Produto',
    links: [
      { label: 'Roadmaps', href: '#' },
      { label: 'Dashboard', href: '#' },
      { label: 'Registros', href: '#' }
    ]
  },
  {
    title: 'Empresa',
    links: [
      { label: 'GitHub', href: 'https://github.com/maisondev' },
      { label: 'Site', href: 'https://sinapses.site' },
      { label: 'Contato', href: '#' }
    ]
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Documentação', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Ajuda', href: '#' }
    ]
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:to-slate-900">
    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-4 py-16 sm:py-24 md:py-32">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
        <!-- Left side - Content -->
        <div class="space-y-6 sm:space-y-8">
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
              Conecte seus <span class="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">conhecimentos</span> em sinapses
            </h1>
            <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300">
              Crie roadmaps de aprendizado, mapeie suas fontes e fortaleça suas conexões de conhecimento
            </p>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-col gap-3 text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40">
                <span class="text-blue-700 dark:text-blue-400 text-xs font-bold">✓</span>
              </span>
              Grátis para começar, sem cartão de crédito
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40">
                <span class="text-purple-700 dark:text-purple-400 text-xs font-bold">✓</span>
              </span>
              Funciona offline, sincroniza automaticamente
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/40">
                <span class="text-cyan-700 dark:text-cyan-400 text-xs font-bold">✓</span>
              </span>
              Acesso ao seu progresso em qualquer dispositivo
            </div>
          </div>
        </div>

        <!-- Right side - Visual: Roadmap Preview -->
        <div class="hidden md:block">
          <div class="relative">
            <div class="absolute -inset-8 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-cyan-900/20 rounded-2xl blur-2xl opacity-40"></div>
            <div class="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              <!-- Roadmap Header -->
              <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 border-b border-slate-200 dark:border-slate-600 px-6 py-4">
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">Português</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Sua rede de aprendizado</p>
              </div>

              <!-- Roadmap Content -->
              <div class="p-6 space-y-4">
                <!-- Block 1 -->
                <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p class="font-semibold text-blue-900 dark:text-blue-300 text-sm">Gramática</p>
                  </div>
                  <div class="p-4 space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full bg-emerald-500"></div>
                      <span class="text-sm text-slate-700 dark:text-slate-300">Verbos e conjugação</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      <span class="text-sm text-slate-700 dark:text-slate-300">Pontuação</span>
                    </div>
                  </div>
                </div>

                <!-- Block 2 -->
                <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div class="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p class="font-semibold text-purple-900 dark:text-purple-300 text-sm">Literatura</p>
                  </div>
                  <div class="p-4 space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      <span class="text-sm text-slate-700 dark:text-slate-300">Romantismo brasileiro</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      <span class="text-sm text-slate-700 dark:text-slate-300">Modernismo</span>
                    </div>
                  </div>
                </div>

                <!-- Progress indicator -->
                <div class="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="font-medium text-slate-700 dark:text-slate-300">Progresso</span>
                    <span class="text-blue-600 dark:text-blue-400 font-semibold">40%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full w-2/5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="border-y border-slate-200 dark:border-slate-800 py-16 sm:py-20 md:py-24 bg-gradient-to-b from-blue-50 via-purple-50/50 to-cyan-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            Tudo para fortalecer suas sinapses
          </h2>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ferramentas completas para mapear, conectar e fortalecer seus conhecimentos
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(benefit, idx) in benefits"
            :key="idx"
            class="p-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div class="mb-4">
              <BenefitIcon :icon="benefit.icon" :size="56" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {{ benefit.title }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Science Section -->
    <section class="max-w-6xl mx-auto px-4 py-16 sm:py-20 md:py-24">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <!-- Left: Text -->
        <div class="space-y-4 sm:space-y-6">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Baseado em neurociência
            </h2>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              "Neurons that fire together, wire together" — Lei de Hebb
              <span class="block text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400 italic">
                "Neurônios que disparam juntos, se conectam"
              </span>
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <span class="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Estrutura = Trilhas Neurais</h3>
                <p class="text-slate-600 dark:text-slate-400">Roadmaps organizam seu aprendizado em sequências lógicas, criando padrões neurais mais eficientes</p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                  <span class="text-purple-600 dark:text-purple-400 font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Repetição = Consolidação</h3>
                <p class="text-slate-600 dark:text-slate-400">Registros diários reforçam suas sinapses, transformando aprendizado temporário em memória duradoura</p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/40">
                  <span class="text-cyan-600 dark:text-cyan-400 font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Feedback = Plasticidade</h3>
                <p class="text-slate-600 dark:text-slate-400">Visualizar progresso ativa recompensa cerebral, fortalecendo as conexões que você está construindo</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="hidden md:block">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl blur-3xl opacity-30"></div>
            <div class="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
              <div class="space-y-6">
                <div class="text-center">
                  <p class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Seu cérebro aprendendo</p>
                </div>

                <!-- Neural visualization -->
                <div class="flex justify-center items-center gap-4 py-8">
                  <!-- Neuron 1 -->
                  <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center mx-auto mb-2">
                      <span class="text-white text-xs font-bold">T1</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400">Tópico 1</p>
                  </div>

                  <!-- Connection -->
                  <div class="flex-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"></div>

                  <!-- Neuron 2 -->
                  <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-purple-500 dark:bg-purple-400 flex items-center justify-center mx-auto mb-2">
                      <span class="text-white text-xs font-bold">T2</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400">Tópico 2</p>
                  </div>

                  <!-- Connection -->
                  <div class="flex-1 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full"></div>

                  <!-- Neuron 3 -->
                  <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-cyan-500 dark:bg-cyan-400 flex items-center justify-center mx-auto mb-2">
                      <span class="text-white text-xs font-bold">T3</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400">Tópico 3</p>
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <p class="text-xs text-slate-600 dark:text-slate-400">
                    <span class="font-semibold">Quanto mais forte a conexão</span>, mais fácil lembrar e aplicar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-6xl mx-auto px-4 py-16 sm:py-24 md:py-32 text-center bg-gradient-to-b from-transparent via-blue-50/30 to-purple-50/30 dark:via-blue-950/10 dark:to-purple-950/10 rounded-3xl">
      <div class="space-y-6 sm:space-y-8">
        <div class="space-y-3 sm:space-y-4">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Comece a conectar seus conhecimentos
          </h2>
          <p class="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Crie seu primeiro roadmap e fortaleça suas sinapses de aprendizado
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="openRegister"
            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Começar agora →
          </button>
          <button
            @click="openLogin"
            class="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors duration-200"
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </section>

    <!-- Auth Modal -->
    <div
      v-if="showAuthModal"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      @click="showAuthModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8"
        @click.stop
      >
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ authMode === 'register' ? 'Criar conta' : 'Entrar' }}
        </h2>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <input
              v-model="email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              :placeholder="authMode === 'register' ? 'seu@email.com' : 'seu@email.com'"
              @keyup.enter="submitAuth"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <input
              v-model="password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              :placeholder="authMode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'"
              @keyup.enter="submitAuth"
            />
          </div>

          <div v-if="authMode === 'register'" class="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <input
              id="landing-consent"
              v-model="consentGiven"
              type="checkbox"
              class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer flex-shrink-0"
            />
            <label for="landing-consent" class="text-xs text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
              Li e aceito a
              <a href="#/privacidade" class="text-blue-600 dark:text-blue-400 hover:underline" @click="showAuthModal = false">Política de Privacidade</a>
              e os
              <a href="#/termos" class="text-blue-600 dark:text-blue-400 hover:underline" @click="showAuthModal = false">Termos de Serviço</a>
              do Sinapses.
            </label>
          </div>

          <p v-if="authError" class="text-sm text-red-600 dark:text-red-400">
            {{ authError }}
          </p>
        </div>

        <div class="flex gap-2 mb-4">
          <button
            @click="submitAuth"
            :disabled="isSubmitting || (authMode === 'register' && !consentGiven)"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
          >
            {{ isSubmitting ? 'Carregando...' : 'Continuar' }}
          </button>
          <button
            @click="showAuthModal = false"
            class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>

        <button
          type="button"
          class="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
          @click="authMode = authMode === 'login' ? 'register' : 'login'; authError = null; consentGiven = false"
        >
          {{ authMode === 'login' ? 'Criar conta' : 'Já tenho conta' }}
        </button>
      </div>
    </div>

  </div>
</template>
