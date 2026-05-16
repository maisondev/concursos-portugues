<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useRoadmapStore } from '@/stores/roadmap'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/templates/AppLayout.vue'
import { onMounted } from 'vue'

const settingsStore = useSettingsStore()
const roadmapStore = useRoadmapStore()
const authStore = useAuthStore()

onMounted(() => {
  settingsStore.initSettings()
  authStore.init()
  roadmapStore.initRoadmap()
})
</script>

<template>
  <AppLayout />
</template>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #1F2937;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #10B981;
  text-decoration: inherit;
}
a:hover {
  color: #059669;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #10B981;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #1F2937;
    background-color: #F8FAFC;
  }
  a {
    color: #10B981;
  }
  a:hover {
    color: #059669;
  }
  button {
    background-color: #F1F5F9;
    color: #1F2937;
  }
  button:hover {
    border-color: #10B981;
  }
}
</style>
