<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface HelpSection {
  title: string
  content: string
}

const sections: HelpSection[] = [
  {
    title: 'O que é um Roadmap?',
    content: 'Um Roadmap é um mapa de estudo personalizado que você cria para organizar seu aprendizado. Ele serve como um guia estruturado para atingir seus objetivos de estudo, permitindo que você acompanhe o progresso em cada seção.'
  },
  {
    title: 'O que são Módulos?',
    content: 'Módulos (ou Blocos) são as seções principais dentro de um Roadmap. Cada módulo representa um tema ou assunto específico que você deseja estudar. Por exemplo, em um roadmap de Português, você pode ter módulos para "Gramática", "Interpretação de Textos", "Redação", etc.'
  },
  {
    title: 'O que são Tópicos?',
    content: 'Tópicos são subtemas dentro de cada Módulo. Eles decompõem o conteúdo do módulo em partes menores e mais gerenciáveis. Por exemplo, dentro do módulo "Gramática", você pode ter tópicos como "Verbos", "Substantivos", "Concordância", etc.'
  },
  {
    title: 'O que são Recursos?',
    content: 'Recursos são materiais de estudo que você associa a cada Tópico. Podem ser vídeos do YouTube, documentos no Google Drive, links para artigos, documentos em PDF ou arquivos armazenados localmente no seu computador.'
  },
  {
    title: 'Como criar um novo Roadmap?',
    content: 'Na página inicial, clique no botão "Novo Roadmap" no canto superior direito. Preencha o título e a descrição (opcional) do seu roadmap e clique em "Criar". Você será automaticamente levado para o novo roadmap.'
  },
  {
    title: 'Como adicionar Módulos?',
    content: 'Ao estar dentro de um Roadmap, clique em "+ Adicionar Módulo" na seção de progresso. Digite o título do módulo, escolha a prioridade (Normal, Alta, Máxima) e clique em "Criar".'
  },
  {
    title: 'Como adicionar Tópicos?',
    content: 'Clique em um Módulo para abrir seus detalhes. Na seção de Tópicos, clique em "+ Novo Tópico", digite o título e clique em "Criar". O tópico será adicionado à lista de tópicos do módulo.'
  },
  {
    title: 'Como adicionar Recursos?',
    content: 'Selecione um Tópico na lista. No painel direito, escolha o tipo de recurso (YouTube, Google Drive, Documento, Link ou Arquivo Local), adicione o título/descrição, insira a URL (ou selecione o arquivo local) e clique em "+ Adicionar".'
  },
  {
    title: 'Como acompanhar meu progresso?',
    content: 'O sistema rastreia automaticamente o progresso de cada tópico. Você pode marcar tópicos como "Não iniciado", "Em andamento" ou "Concluído". O progresso geral é mostrado em barras de progresso em diferentes níveis (Roadmap, Módulo).'
  },
  {
    title: 'O que significa Streak?',
    content: 'Streak é uma sequência contínua de dias em que você registrou atividade de estudo. Quanto maior o streak, mais consistente você está sendo com seus estudos. O sistema mostra o número de dias consecutivos no topo da página.'
  },
  {
    title: 'Como usar o Log Diário?',
    content: 'No Dashboard, você pode registrar diariamente o que estudou, o tempo investido, quantas questões resolveu e como se sentiu. Esses registros ajudam a manter o controle do seu progresso e motivação.'
  },
  {
    title: 'O que é o Ranking de Professores?',
    content: 'O Ranking de Professores é uma funcionalidade que permite criar listas personalizadas dos melhores professores para cada matéria ou assunto que você estuda. Serve para identificar e organizar qual é o melhor professor em cada área de conhecimento.'
  },
  {
    title: 'Como funciona o Ranking de Professores?',
    content: 'Você cria um ranking com um nome específico (ex: "Melhores Professores de Matemática"). Depois, você adiciona os professores que você encontrar e gosta para aquela matéria, avaliando cada um com uma nota de 1 a 5 estrelas. Assim, quando você precisa estudar aquele assunto, sabe exatamente quais são os melhores professores para aprender com eles. Por exemplo: em um ranking de "Python", você pode adicionar Guido van Rossum (5⭐), David Beazley (5⭐), e Nate Ritter (4⭐), e sempre que precisar aprender Python, você consulta seu ranking para escolher com quem estudar.'
  },
  {
    title: 'Como editar um Roadmap?',
    content: 'Na página inicial, passe o mouse sobre um Roadmap e clique no ícone de lápis. Uma modal aparecerá permitindo que você edite o título, descrição, avaliação e cor do roadmap.'
  },
  {
    title: 'Como mudar a cor de um Roadmap?',
    content: 'Ao editar um Roadmap, você verá uma paleta de cores na modal de edição. Selecione a cor desejada (Azul, Vermelho, Verde, Amarelo, Roxo, Rosa, Laranja ou Cinza) para mudar a cor do card.'
  },
  {
    title: 'Como ordenar meus Roadmaps?',
    content: 'Na página inicial, você pode usar os botões de seta (↑ e ↓) que aparecem ao passar o mouse sobre um Roadmap para mover ele para cima ou para baixo na lista, reordenando seus roadmaps conforme desejar.'
  },
  {
    title: 'Como usar o tema escuro?',
    content: 'Clique no ícone de sol/lua no canto superior direito da barra de navegação para alternar entre o tema claro e escuro. Sua preferência será salva automaticamente.'
  }
]

const expandedIndex = ref<number | null>(null)

const toggleSection = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto p-4 space-y-8 py-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Central de Ajuda
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Saiba como usar o Concursos Português
        </p>
      </div>

      <!-- Help Sections -->
      <div class="space-y-3">
        <div
          v-for="(section, idx) in sections"
          :key="idx"
          class="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <button
            @click="toggleSection(idx)"
            class="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white text-left">
              {{ section.title }}
            </h3>
            <ChevronDownIcon
              :class="[
                'w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform',
                expandedIndex === idx ? 'rotate-180' : ''
              ]"
            />
          </button>

          <Transition
            enter-active-class="transition-all duration-200"
            leave-active-class="transition-all duration-200"
            enter-from-class="max-h-0"
            enter-to-class="max-h-96"
            leave-from-class="max-h-96"
            leave-to-class="max-h-0"
          >
            <div
              v-if="expandedIndex === idx"
              class="overflow-hidden"
            >
              <p class="p-4 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700">
                {{ section.content }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- FAQ Footer -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Precisa de mais ajuda?
        </h3>
        <p class="text-blue-800 dark:text-blue-200">
          Entre em contato ou consulte a documentação do projeto no GitHub
        </p>
      </div>
    </div>
  </div>
</template>
