<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LinkIcon } from '@heroicons/vue/24/outline'

interface ContactLink {
  name: string
  icon: string
  url: string
  color: string
}

const contactLinks: ContactLink[] = [
  {
    name: 'Instagram',
    icon: '📷',
    url: 'https://www.instagram.com/sinapses.site/',
    color: 'from-pink-400 to-red-500'
  },
  {
    name: 'Twitter',
    icon: '𝕏',
    url: 'https://x.com/sinapsesite',
    color: 'from-gray-700 to-gray-900'
  },
  {
    name: 'Email',
    icon: '✉️',
    url: 'mailto:hello@sinapses.site',
    color: 'from-blue-400 to-blue-600'
  }
]

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    alert('Por favor, preencha todos os campos obrigatórios')
    return
  }

  // Enviar para o email via mailto
  const mailto = `mailto:hello@sinapses.site?subject=${encodeURIComponent(formData.value.subject || 'Contato via site')}&body=${encodeURIComponent(
    `Nome: ${formData.value.name}\nEmail: ${formData.value.email}\n\nMensagem:\n${formData.value.message}`
  )}`

  window.location.href = mailto

  // Reset do formulário
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto p-4 py-8 space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          Entre em Contato
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tem dúvidas, sugestões ou feedback? Adoramos ouvir de você!
        </p>
      </div>

      <!-- Contact Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          v-for="link in contactLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 hover:shadow-lg"
        >
          <div class="flex flex-col items-center space-y-3">
            <div class="text-4xl group-hover:scale-110 transition-transform duration-300">
              {{ link.icon }}
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ link.name }}
            </h3>
            <p v-if="link.name === 'Email'" class="text-sm text-gray-500 dark:text-gray-400 break-all">
              hello@sinapses.site
            </p>
            <p v-else class="text-sm text-gray-500 dark:text-gray-400">
              Siga-nos
            </p>
          </div>
        </a>
      </div>

      <!-- Contact Form -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Envie uma Mensagem
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            Preencha o formulário abaixo e entraremos em contato em breve.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Seu nome"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="seu.email@exemplo.com"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assunto
            </label>
            <input
              v-model="formData.subject"
              type="text"
              placeholder="Ex: Feedback, Dúvida, Bug Report"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mensagem <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.message"
              placeholder="Digite sua mensagem aqui..."
              rows="5"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <EnvelopeIcon class="w-5 h-5" />
            Enviar Mensagem
          </button>

          <!-- Success Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div
              v-if="submitted"
              class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200"
            >
              ✓ Redirecionando para seu cliente de email...
            </div>
          </Transition>
        </form>
      </div>

      <!-- FAQ Shortcuts -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Dúvidas Comuns?
        </h3>
        <p class="text-blue-800 dark:text-blue-200 mb-4">
          Confira nossa <router-link to="/help" class="underline hover:opacity-75">Central de Ajuda</router-link> para respostas rápidas.
        </p>
      </div>
    </div>
  </div>
</template>
