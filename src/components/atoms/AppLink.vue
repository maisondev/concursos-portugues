<script setup lang="ts">
interface Props {
  href: string
  external?: boolean
}

withDefaults(defineProps<Props>(), {
  external: false
})

defineEmits<{
  click: [e: MouseEvent]
}>()

function isYoutube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function isDrive(url: string): boolean {
  return url.includes('drive.google.com')
}

function getIcon(url: string): string {
  if (isYoutube(url)) return '▶️'
  if (isDrive(url)) return '📄'
  return '🔗'
}
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline transition-colors"
    @click="$emit('click', $event)"
  >
    <span>{{ getIcon(href) }}</span>
    <slot />
    <span v-if="external" class="text-xs">↗</span>
  </a>
</template>
