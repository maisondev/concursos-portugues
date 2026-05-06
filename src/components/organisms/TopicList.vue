<script setup lang="ts">
import type { Topic } from '@/types'
import TopicItem from '@/components/molecules/TopicItem.vue'

interface Props {
  topics: Topic[]
  blockId: string
}

defineProps<Props>()

defineEmits<{
  'update:topic-status': [blockId: string, topicId: string, status: string]
  'open-topic': [topic: Topic]
}>()
</script>

<template>
  <div class="space-y-2">
    <TopicItem
      v-for="topic in topics"
      :key="topic.id"
      :topic="topic"
      :block-id="blockId"
      @update:status="$emit('update:topic-status', blockId, topic.id, $event)"
      @open="$emit('open-topic', topic)"
    />
  </div>
</template>
