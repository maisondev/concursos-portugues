<template>
  <AppModal
    :open="open"
    title="Enviar Feedback"
    submit-label="Enviar"
    cancel-label="Cancelar"
    @submit="submitFeedback"
    @cancel="$emit('close')"
  >
    <div class="space-y-4">
      <div v-if="error" class="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
        {{ error }}
      </div>

      <div v-if="success" class="p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm">
        ✓ Feedback enviado com sucesso! Obrigado.
      </div>

      <div v-if="!success">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Seu Nome
        </label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="João Silva"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          :disabled="isSubmitting"
        />
      </div>

      <div v-if="!success">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Seu Email
        </label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="seu@email.com"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          :disabled="isSubmitting"
        />
      </div>

      <div v-if="!success">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mensagem
        </label>
        <textarea
          v-model="formData.message"
          placeholder="Descreva seu feedback ou bug..."
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
          :disabled="isSubmitting"
        ></textarea>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/components/atoms/AppModal.vue'
import { api } from '@/services/api'

interface Props {
  open: boolean
}

defineProps<Props>()
defineEmits<{
  close: []
}>()

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const submitFeedback = async () => {
  error.value = null

  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    error.value = 'Preencha todos os campos'
    return
  }

  isSubmitting.value = true

  try {
    await api.post('/api/feedbacks', {
      name: formData.value.name,
      email: formData.value.email,
      message: formData.value.message
    })

    success.value = true

    setTimeout(() => {
      formData.value = { name: '', email: '', message: '' }
      success.value = false
      error.value = null
      emit('close')
    }, 2000)
  } catch (err: any) {
    error.value = err.message || 'Erro ao enviar feedback. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
