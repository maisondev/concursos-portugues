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
  'update:topic-title': [blockId: string, topicId: string, title: string]
  'delete:topic': [blockId: string, topicId: string]
  'open-topic': [topic: Topic]
  'move-topic-up': [blockId: string, topicId: string]
  'move-topic-down': [blockId: string, topicId: string]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
    <TopicItem
      v-for="(topic, index) in topics"
      :key="topic.id"
      :topic="topic"
      :block-id="blockId"
      :index="index"
      :total="topics.length"
      @update:status="$emit('update:topic-status', blockId, topic.id, $event)"
      @update:title="$emit('update:topic-title', blockId, topic.id, $event)"
      @delete="$emit('delete:topic', blockId, topic.id)"
      @open="$emit('open-topic', topic)"
      @move-up="$emit('move-topic-up', blockId, topic.id)"
      @move-down="$emit('move-topic-down', blockId, topic.id)"
    />
  </div>
</template>
