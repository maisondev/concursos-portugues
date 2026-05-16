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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
    <!-- Navigation -->
    <nav class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Roadmap
        </div>
        <div class="flex gap-2">
          <AppButton
            variant="ghost"
            size="sm"
            @click="openLogin"
          >
            Entrar
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            @click="openRegister"
          >
            Cadastro
          </AppButton>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-4 py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Left side - Content -->
        <div class="space-y-6">
          <div class="space-y-3">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Organize seus <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">estudos</span> de forma inteligente
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              Crie roadmaps de aprendizado, organize recursos de estudo e acompanhe seu progresso em tempo real
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <AppButton
              variant="primary"
              size="lg"
              @click="openRegister"
              class="flex items-center justify-center gap-2"
            >
              Começar Agora
              <span>→</span>
            </AppButton>
            <AppButton
              variant="secondary"
              size="lg"
              @click="openLogin"
              class="flex items-center justify-center gap-2"
            >
              Já tenho conta
            </AppButton>
          </div>

          <!-- Trust badges -->
          <div class="flex gap-4 pt-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <span class="text-green-600 dark:text-green-400">✓</span>
              Grátis para começar
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-600 dark:text-green-400">✓</span>
              Sem cartão de crédito
            </div>
          </div>
        </div>

        <!-- Right side - Visual -->
        <div class="hidden md:block">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur-3xl opacity-20"></div>
            <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 space-y-4">
              <div class="space-y-2">
                <div class="h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded w-2/3"></div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/6"></div>
              </div>
              <div class="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex gap-2">
                  <div class="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded"></div>
                  <div class="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
                <div class="flex gap-2">
                  <div class="h-8 w-8 bg-green-100 dark:bg-green-900 rounded"></div>
                  <div class="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="bg-white dark:bg-gray-800 py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Por que usar Roadmap?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Tudo que você precisa para organizar e acompanhar seus estudos
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(benefit, idx) in benefits"
            :key="idx"
            class="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          >
            <div class="text-4xl mb-3">{{ benefit.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ benefit.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Pronto para começar?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Crie sua conta em segundos e organize seus estudos agora mesmo
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <AppButton
            variant="primary"
            size="lg"
            @click="openRegister"
            class="bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            Cadastre-se
            <span>→</span>
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="openLogin"
            class="border-white text-white hover:bg-white/10 flex items-center justify-center gap-2"
          >
            Já tenho conta
          </AppButton>
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
