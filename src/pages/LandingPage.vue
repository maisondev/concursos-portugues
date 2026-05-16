<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppButton from '@/components/atoms/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'register'>('register')
const email = ref('')
const password = ref('')
const authError = ref<string | null>(null)
const isSubmitting = ref(false)

const benefits = [
  {
    icon: '📚',
    title: 'Roadmaps Organizados',
    description: 'Crie e organize múltiplos roadmaps de estudo com blocos, tópicos e recursos estruturados'
  },
  {
    icon: '📊',
    title: 'Acompanhamento Detalhado',
    description: 'Veja seu progresso em tempo real com métricas de conclusão por roadmap'
  },
  {
    icon: '📝',
    title: 'Registros Diários',
    description: 'Mantenha um registro diário de seus estudos, marca dias consecutivos de dedicação'
  },
  {
    icon: '🎓',
    title: 'Ranking de Professores',
    description: 'Avalie e classifique seus professores para compartilhar conhecimento com a comunidade'
  },
  {
    icon: '📱',
    title: 'Funciona Offline',
    description: 'Use a aplicação mesmo sem internet - suas mudanças sincronizam automaticamente'
  },
  {
    icon: '🔒',
    title: 'Seus Dados Protegidos',
    description: 'Autenticação segura com JWT e criptografia de senhas com bcrypt'
  }
]

function openRegister() {
  authMode.value = 'register'
  email.value = ''
  password.value = ''
  authError.value = null
  showAuthModal.value = true
}

function openLogin() {
  authMode.value = 'login'
  email.value = ''
  password.value = ''
  authError.value = null
  showAuthModal.value = true
}

async function submitAuth() {
  authError.value = null
  isSubmitting.value = true

  try {
    if (authMode.value === 'register') {
      await authStore.register(email.value, password.value)
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
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-4 py-32">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <!-- Left side - Content -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
              Organize seus <span class="text-emerald-600 dark:text-emerald-500">estudos</span> com propósito
            </h1>
            <p class="text-xl text-slate-600 dark:text-slate-300">
              Crie roadmaps de aprendizado estruturados, organize recursos e acompanhe seu progresso com precisão
            </p>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-col gap-3 text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <span class="text-emerald-700 dark:text-emerald-400 text-xs font-bold">✓</span>
              </span>
              Grátis para começar, sem cartão de crédito
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <span class="text-emerald-700 dark:text-emerald-400 text-xs font-bold">✓</span>
              </span>
              Funciona offline, sincroniza automaticamente
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <span class="text-emerald-700 dark:text-emerald-400 text-xs font-bold">✓</span>
              </span>
              Acesso ao seu progresso em qualquer dispositivo
            </div>
          </div>
        </div>

        <!-- Right side - Visual -->
        <div class="hidden md:block">
          <div class="relative">
            <div class="absolute -inset-8 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl blur-2xl opacity-40"></div>
            <div class="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-12 space-y-6">
              <div class="space-y-3">
                <div class="h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg w-3/4"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
              </div>
              <div class="pt-6 space-y-4 border-t border-slate-200 dark:border-slate-700">
                <div class="flex gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                </div>
                <div class="flex gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="border-y border-slate-200 dark:border-slate-800 py-24 bg-white/50 dark:bg-slate-800/30">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-20">
          <h2 class="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Tudo que você precisa para aprender melhor
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Uma plataforma completa para organizar seu aprendizado, acompanhar progresso e manter o foco
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(benefit, idx) in benefits"
            :key="idx"
            class="p-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-lg"
          >
            <div class="text-5xl mb-4">{{ benefit.icon }}</div>
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

    <!-- CTA Section -->
    <section class="max-w-6xl mx-auto px-4 py-32 text-center">
      <div class="space-y-8">
        <div class="space-y-4">
          <h2 class="text-5xl font-bold text-slate-900 dark:text-white">
            Comece sua jornada de aprendizado
          </h2>
          <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que organizam seus roadmaps com Roadmap
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="openRegister"
            class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Começar agora →
          </button>
          <button
            @click="openLogin"
            class="px-8 py-4 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-semibold rounded-lg transition-colors duration-200"
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 dark:bg-black text-gray-400 py-8">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p>© 2026 Roadmap. Todos os direitos reservados.</p>
      </div>
    </footer>

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

          <p v-if="authError" class="text-sm text-red-600 dark:text-red-400">
            {{ authError }}
          </p>
        </div>

        <div class="flex gap-2 mb-4">
          <button
            @click="submitAuth"
            :disabled="isSubmitting"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
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
          @click="authMode = authMode === 'login' ? 'register' : 'login'; authError = null"
        >
          {{ authMode === 'login' ? 'Criar conta' : 'Já tenho conta' }}
        </button>
      </div>
    </div>
  </div>
</template>
