<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-900',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-7 py-3 text-lg'
}
</script>

<template>
  <button
    :class="[
      'rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size]
    ]"
    :disabled="disabled || loading"
    @click="(e) => $emit('click', e)"
  >
    <span v-if="loading" class="inline-block mr-2">⏳</span>
    <slot />
  </button>
</template>
