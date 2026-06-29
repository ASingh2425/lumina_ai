import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PROGRESS, type UserProgress } from '../types/progress'
import { API_URL } from '../config'

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

function loadLocalProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PROGRESS }
}

function saveLocalProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadLocalProgress)

  // Get current user id
  const getUserId = (): string => {
    try {
      const rawUser = localStorage.getItem('user')
      if (rawUser) {
        return JSON.parse(rawUser).id.toString()
      }
    } catch {
      /* ignore */
    }
    return "local"
  }

  // Load progress from backend on mount
  useEffect(() => {
    const userId = getUserId()
    if (userId !== "local") {
      fetch(`${API_URL}/progress/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user_id) {
            const updated = {
              ...progress,
              xp: data.xp,
              completedLessons: data.completed_lessons,
              completedSteps: data.completed_steps
            }
            setProgress(updated)
            saveLocalProgress(updated)
          }
        })
        .catch((err) => console.log("Failed to sync progress:", err))
    }
  }, [])

  // Sync progress function
  const syncToBackend = async (updated: UserProgress) => {
    const userId = getUserId()
    if (userId === "local") return

    try {
      await fetch(`${API_URL}/progress/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          xp: updated.xp,
          streak: updated.streak,
          completed_lessons: updated.completedLessons,
          completed_steps: updated.completedSteps
        })
      })
    } catch (err) {
      console.log("Failed to sync progress to database:", err)
    }
  }

  useEffect(() => {
    const today = todayString()
    if (progress.lastActiveDate !== today) {
      const updated = {
        ...progress,
        streak: computeStreak(progress.lastActiveDate, progress.streak),
        lastActiveDate: today,
      }
      setProgress(updated)
      saveLocalProgress(updated)
      syncToBackend(updated)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addXp = useCallback((amount: number) => {
    setProgress((prev) => {
      const updated = { ...prev, xp: prev.xp + amount }
      saveLocalProgress(updated)
      syncToBackend(updated)
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
      saveLocalProgress(updated)
      syncToBackend(updated)
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
      saveLocalProgress(updated)
      syncToBackend(updated)
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
