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
  'move-topic-up': [blockId: string, topicId: string]
  'move-topic-down': [blockId: string, topicId: string]
}>()
</script>

<template>
  <div class="space-y-2">
    <TopicItem
      v-for="(topic, index) in topics"
      :key="topic.id"
      :topic="topic"
      :block-id="blockId"
      :index="index"
      :total="topics.length"
      @update:status="$emit('update:topic-status', blockId, topic.id, $event)"
      @open="$emit('open-topic', topic)"
      @move-up="$emit('move-topic-up', blockId, topic.id)"
      @move-down="$emit('move-topic-down', blockId, topic.id)"
    />
  </div>
</template>
