<script setup lang="ts">
interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

const iconMap: Record<string, string> = {
  // Navigation
  'arrow-left': 'M15 19l-7-7 7-7',
  'arrow-right': 'M9 5l7 7-7 7',
  'home': 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0',
  'menu': 'M3 5h18M3 12h18M3 19h18',
  'close': 'M6 18L18 6M6 6l12 12',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-up': 'M18 15l-6-6-6 6',

  // Actions
  'plus': 'M12 5v14m-7-7h14',
  'trash': 'M9 3v1H5v2h1v12a2 2 0 002 2h8a2 2 0 002-2V6h1V4h-4V3H9z',
  'edit': 'M3 17.25V21h3.75L17.81 9.94m-6.75-6.75l2.83-2.83a2 2 0 012.83 0l2.83 2.83a2 2 0 010 2.83l-2.83 2.83',
  'eye': 'M12 5C7 5 2.73 8.11 1 12.5c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z',
  'check': 'M5 13l3 3L19 7',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'star-outline': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',

  // Document/File
  'file': 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z',
  'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  'document-text': 'M9 12h6m-6 4h6m2-13H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z',

  // Resources
  'play': 'M5 3l14 9-14 9V3z',
  'video': 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2z',
  'link': 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  'download': 'M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4',

  // Status
  'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'alert': 'M12 9v2m0 4v2m1.581-6.08A2 2 0 1010.42 3H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4.081c0-.99-.592-1.842-1.419-2.419z',
  'info': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',

  // Settings
  'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',

  // Misc
  'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'flag': 'M3 21v-4m0 0V5a2 2 0 012-2h2.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 01.707-.293H17a2 2 0 012 2v4m-13 5h10m-10 0a2 2 0 102 2 2 2 0 00-2-2z'
}
</script>

<template>
  <svg
    :class="[sizeMap[size], $attrs.class]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="iconMap[name] || iconMap['info']" />
  </svg>
</template>
