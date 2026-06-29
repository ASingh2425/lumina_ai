export interface UserProgress {
  xp: number
  streak: number
  lastActiveDate: string
  completedLessons: string[]
  completedSteps: Record<string, string[]>
}

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  completedLessons: [],
  completedSteps: {},
}
