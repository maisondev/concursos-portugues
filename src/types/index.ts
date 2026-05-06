// Resource Types
export type ResourceType = 'youtube' | 'drive' | 'document' | 'link' | 'local'

export interface Resource {
  id: string
  type: ResourceType
  label: string
  url?: string           // para URLs externas
  localPath?: string     // para arquivos locais (ex: C:\Users\maiso\Documents\)
  duration?: string
  addedAt: string
  viewed: boolean
  viewedAt?: string
  rating: number         // 0-5 (0 = sem rating)
}

// Topic Types
export type TopicStatus = 'nao_iniciado' | 'em_andamento' | 'concluido'

export interface Topic {
  id: string
  title: string
  status: TopicStatus
  resources: Resource[]
  notes: string
  questoesSolvidas: number
  acertoPercent: number | null
}

// Block Types
export type BlockPriority = 'normal' | 'alta' | 'maxima'

export interface Block {
  id: string
  order: number
  title: string
  subtitle?: string
  priority: BlockPriority
  topics: Topic[]
}

// Roadmap Types
export type RoadmapColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray'

export interface Roadmap {
  id: string
  title: string
  description: string
  blocks: Block[]
  createdAt: string
  updatedAt: string
  order?: number
  rating?: number
  color?: RoadmapColor
}

// Daily Log Types
export interface DailyLogEntry {
  id: string
  date: string
  fiz: string
  fareiAmanha: string
  topicsWorkedOn: string[]
  minutosEstudados: number
  questoesFeitas: number
  mood: 1 | 2 | 3 | 4 | 5
}

// Progress Types
export interface ProgressSnapshot {
  roadmapId: string
  totalTopics: number
  completedTopics: number
  inProgressTopics: number
  totalQuestoes: number
  avgAcerto: number | null
  streakDays: number
  lastStudiedDate: string | null
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark'
  language: 'pt-BR'
  dailyGoalMinutes: number
  dailyGoalQuestoes: number
  showStreak: boolean
  deletePassword?: string
}

// Storage Schema
export interface AppStorageSchema {
  version: number
  roadmaps: Record<string, Roadmap>
  progress: Record<string, Record<string, TopicStatus>>
  dailyLogs: DailyLogEntry[]
  settings: AppSettings
  lastSaved: string
}

// SVG Layout Types
export interface NodePosition {
  blockId: string
  x: number
  y: number
  width: number
  height: number
}

export interface EdgePath {
  from: string
  to: string
  d: string
}

export interface LayoutResult {
  nodes: NodePosition[]
  edges: EdgePath[]
  totalHeight: number
}
