import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PROGRESS, type UserProgress } from '../types/progress'

const STORAGE_KEY = 'lumina-progress'

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function computeStreak(lastDate: string, currentStreak: number): number {
  if (!lastDate) return 1

  const last = new Date(lastDate)
  const today = new Date(todayString())
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return currentStreak
  if (diffDays === 1) return currentStreak + 1
  return 1
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PROGRESS }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress)

  useEffect(() => {
    const today = todayString()
    if (progress.lastActiveDate !== today) {
      const updated = {
        ...progress,
        streak: computeStreak(progress.lastActiveDate, progress.streak),
        lastActiveDate: today,
      }
      setProgress(updated)
      saveProgress(updated)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addXp = useCallback((amount: number) => {
    setProgress((prev) => {
      const updated = { ...prev, xp: prev.xp + amount }
      saveProgress(updated)
      return updated
    })
  }, [])

  const completeStep = useCallback((lessonId: string, stepId: string, xp: number) => {
    setProgress((prev) => {
      const steps = prev.completedSteps[lessonId] ?? []
      if (steps.includes(stepId)) return prev

      const updatedSteps = { ...prev.completedSteps, [lessonId]: [...steps, stepId] }

      const updated: UserProgress = {
        ...prev,
        xp: prev.xp + xp,
        completedSteps: updatedSteps,
        completedLessons: prev.completedLessons,
        lastActiveDate: todayString(),
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const completeLesson = useCallback((lessonId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const updated: UserProgress = {
        ...prev,
        xp: prev.xp + xpReward,
        completedLessons: [...prev.completedLessons, lessonId],
        lastActiveDate: todayString(),
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const isStepComplete = useCallback(
    (lessonId: string, stepId: string) => {
      return (progress.completedSteps[lessonId] ?? []).includes(stepId)
    },
    [progress],
  )

  const isLessonComplete = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress],
  )

  return {
    progress,
    addXp,
    completeStep,
    completeLesson,
    isStepComplete,
    isLessonComplete,
  }
}
