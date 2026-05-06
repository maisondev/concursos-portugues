<script setup lang="ts">
interface Props {
  modelValue: boolean | 'indeterminate'
  label?: string
  disabled?: boolean
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
}>()

function toggle() {
  // Ciclo: false -> true -> indeterminate -> false
  const current = this.$props.modelValue
  if (current === false) {
    this.$emit('update:modelValue', true)
  } else if (current === true) {
    this.$emit('update:modelValue', 'indeterminate')
  } else {
    this.$emit('update:modelValue', false)
  }
}
</script>

<template>
  <label :class="['flex items-center gap-2 cursor-pointer', { 'opacity-50 cursor-not-allowed': disabled }]">
    <div class="relative">
      <input
        :checked="modelValue === true"
        :indeterminate="modelValue === 'indeterminate'"
        :disabled="disabled"
        type="checkbox"
        class="sr-only"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <div
        :class="[
          'w-5 h-5 border-2 rounded transition-colors',
          modelValue === true ? 'bg-blue-500 border-blue-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
        ]"
      >
        <svg
          v-if="modelValue === true"
          class="w-4 h-4 text-white absolute top-0.5 left-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <svg
          v-else-if="modelValue === 'indeterminate'"
          class="w-4 h-4 text-blue-600 absolute top-0.5 left-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
    </div>
    <span v-if="label" class="text-gray-900 dark:text-white">{{ label }}</span>
  </label>
</template>
