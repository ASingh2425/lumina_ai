export type StepType =
  | 'story'
  | 'visual'
  | 'experiment'
  | 'math'
  | 'code'
  | 'quiz'
  | 'sandbox'

export type WidgetType = 'gradient-descent' | 'linear-regression' | 'k-means' | 'knn' | 'numpy-slice' | 'decision-tree' | 'dbscan' | 'neural-network' | 'self-attention' | 'rag-pipeline' | 'tokenizer' | 'cnn' | 'pca' | 'random-forest' | 'interview-recruiter' | 'project-push' | 'netflix-simulator' | 'none'

export interface InteractiveCodeLab {
  template: string
  expectedOutput: string
  blanks: {
    key: string
    placeholder: string
    correct: string
  }[]
}

export interface LessonStep {
  id: string
  type: StepType
  title: string
  content?: string
  widget?: WidgetType
  quiz?: QuizQuestion
  code?: string
  interactiveCode?: InteractiveCodeLab
  formula?: string
  mathParts?: MathPart[]
}

export interface QuizQuestion {
  prompt: string
  options: QuizOption[]
  correctId: string
  explanation: string
}

export interface QuizOption {
  id: string
  label: string
}

export interface MathPart {
  symbol: string
  explanation: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  module: string
  xpReward: number
  steps: LessonStep[]
  isPremium?: boolean
  worldId?: string
}
