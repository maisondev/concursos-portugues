<script setup lang="ts">
const changelog = [
  {
    version: '1.4.0',
    date: '2026-05-06',
    features: [
      'Seletor de cores para roadmaps (similar ao Finder do Mac)',
      'Editar e avaliar roadmaps',
      'Ordenar roadmaps por prioridade',
      'Navbar moderna com navegação melhorada'
    ]
  },
  {
    version: '1.3.0',
    date: '2026-05-05',
    features: [
      'Removidos emojis - design flat com ícones Heroicons',
      'Corrção de bugs na navegação',
      'Melhorias na responsividade'
    ]
  },
  {
    version: '1.2.0',
    date: '2026-05-04',
    features: [
      'Sistema de ranking e avaliação de recursos',
      'Adicionado suporte para arquivos locais',
      'Melhorias no armazenamento de dados'
    ]
  },
  {
    version: '1.1.0',
    date: '2026-05-03',
    features: [
      'Painel de progresso com gráficos',
      'Log diário de estudos',
      'Sistema de streak (sequência de dias)'
    ]
  },
  {
    version: '1.0.0',
    date: '2026-05-01',
    features: [
      'Lançamento inicial do Concursos Português',
      'Sistema de roadmaps com módulos e tópicos',
      'Rastreamento de progresso',
      'Gerenciamento de recursos de estudo'
    ]
  }
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto p-4 space-y-8 py-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Changelog
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Histórico de funcionalidades e melhorias
        </p>
      </div>

      <!-- Changelog Items -->
      <div class="space-y-8">
        <div
          v-for="(item, idx) in changelog"
          :key="item.version"
          class="border-l-4 border-blue-500 pl-6 py-4"
        >
          <div class="flex items-baseline gap-4 mb-3">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              v{{ item.version }}
            </h2>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ new Date(item.date).toLocaleDateString('pt-BR') }}
            </span>
          </div>

          <ul class="space-y-2">
            <li
              v-for="(feature, i) in item.features"
              :key="i"
              class="text-gray-700 dark:text-gray-300 flex items-start gap-3"
            >
              <span class="text-blue-500 mt-1 font-bold">+</span>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer message -->
      <div class="border-t border-gray-300 dark:border-gray-700 pt-8 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Fique atento para as próximas atualizações!
        </p>
      </div>
    </div>
  </div>
</template>
