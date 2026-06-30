import { useState } from 'react'
import type { Lesson } from '../types/lesson'

interface HomePageProps {
  lessons: Lesson[]
  onSelectLesson: (id: string) => void
  isLessonComplete: (id: string) => boolean
}

// Daily Challenge dataset
const DAILY_CHALLENGE = {
  question: 'Which of the following is true about non-convex loss functions?',
  options: [
    { id: 'a', label: 'Gradient descent is guaranteed to find the global minimum.' },
    { id: 'b', label: 'Gradient descent can get stuck in local minima or saddle points.' },
    { id: 'c', label: 'They never have a gradient of zero.' },
    { id: 'd', label: 'They only occur in simple linear regression models.' },
  ],
  correctId: 'b',
  xpReward: 50,
  explanation: 'Non-convex functions contain multiple valleys (local minima) and flat regions (saddle points). Simple gradient descent follows the local slope and can easily get trapped, failing to reach the global minimum.',
}

export function HomePage({ lessons, onSelectLesson, isLessonComplete }: HomePageProps) {
  const modules = [...new Set(lessons.map((l) => l.module))]
  
  // Daily challenge states
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [challengeAnswered, setChallengeAnswered] = useState(false)
  const [challengeStatus, setChallengeStatus] = useState<'correct' | 'incorrect' | null>(null)
  const [lockedLesson, setLockedLesson] = useState<string | null>(null)

  const isAdmin = (() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return false
      const parsed = JSON.parse(raw)
      return !!parsed.is_admin
    } catch {
      return false
    }
  })()

  const handleAnswerChallenge = (optId: string) => {
    if (challengeAnswered) return
    setSelectedOpt(optId)
    setChallengeAnswered(true)
    if (optId === DAILY_CHALLENGE.correctId) {
      setChallengeStatus('correct')
    } else {
      setChallengeStatus('incorrect')
    }
  }

  // Calculate user module unlock state (e.g. unlocked if previous module has at least one completed lesson, or just unlocked sequential)
  // Let's implement sequential unlocking for a premium gaming feel!
  let previousModuleCompleted = true

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Welcome & Overview Header */}
      <section className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[var(--color-border)] pb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Learn AI by <span className="text-[var(--color-accent-bright)]">Understanding</span>
          </h1>
          <p className="mt-2 max-w-xl text-[#8b93a7] text-sm leading-relaxed">
            Welcome to the Learning Forest. Play with algorithms, tweak parameters, tap mathematical formulations, and build from scratch.
          </p>
        </div>
        
        {/* Statistics Cards */}
        <div className="flex gap-3 shrink-0">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-5 py-3 text-center min-w-[100px]">
            <span className="text-2xl">🌲</span>
            <span className="text-xs font-semibold text-[#8b93a7] mt-1">Level</span>
            <span className="text-lg font-bold text-white mt-0.5">Apprentice</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-5 py-3 text-center min-w-[100px]">
            <span className="text-2xl">🎓</span>
            <span className="text-xs font-semibold text-[#8b93a7] mt-1">Lessons</span>
            <span className="text-lg font-bold text-white mt-0.5">
              {lessons.filter((l) => isLessonComplete(l.id)).length} / {lessons.length}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Learning Path Skill Tree */}
        <div className="lg:col-span-2 space-y-12 relative">
          
          {/* Vertical connecting line simulator */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-border)] opacity-30 hidden sm:block" />

          {modules.map((moduleName, modIdx) => {
            const moduleLessons = lessons.filter((l) => l.module === moduleName)
            const isModuleCompleted = moduleLessons.every((l) => isLessonComplete(l.id))
            const isUnlocked = previousModuleCompleted
            
            // Set for next iteration
            previousModuleCompleted = isModuleCompleted

            return (
              <div key={moduleName} className={`relative flex gap-6 ${!isUnlocked ? 'opacity-50' : ''}`}>
                {/* Node Milestone Icon on left */}
                <div className="hidden sm:flex shrink-0 z-10">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-bold shadow-lg transition-all duration-300 ${
                      isModuleCompleted
                        ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]'
                        : isUnlocked
                          ? 'border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-accent-bright)] ring-4 ring-[var(--color-accent)]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[#5b6378]'
                    }`}
                  >
                    {isModuleCompleted ? '✓' : modIdx + 1}
                  </div>
                </div>

                {/* Module block */}
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-bright)]">
                      Module {modIdx}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">{moduleName}</h2>
                  </div>

                  <div className="space-y-4">
                    {moduleLessons.map((lesson) => {
                      const done = isLessonComplete(lesson.id)
                      const isPremiumLocked = !!lesson.isPremium && !isAdmin

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (isPremiumLocked) {
                              setLockedLesson(lesson.title)
                            } else {
                              onSelectLesson(lesson.id)
                            }
                          }}
                          className="group flex w-full items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-overlay)] disabled:pointer-events-none"
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                              isPremiumLocked
                                ? 'bg-amber-500/10 text-amber-400'
                                : done
                                  ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                                  : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] group-hover:bg-[var(--color-accent)]/20 group-hover:text-[var(--color-accent-bright)]'
                            }`}
                          >
                            {isPremiumLocked ? '🔒' : done ? '✓' : '→'}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm group-hover:text-[var(--color-accent-bright)] flex items-center gap-2">
                              {lesson.title}
                              {lesson.isPremium && (
                                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                                  Premium
                                </span>
                              )}
                            </h3>
                            <p className="mt-1 text-xs text-[#8b93a7] line-clamp-2 leading-relaxed">{lesson.description}</p>
                          </div>

                          <div className="shrink-0 text-xs font-semibold text-[var(--color-warning)]">
                            +{lesson.xpReward} XP
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Sidebar: Daily Challenge & Achievements */}
        <div className="space-y-6">
          
          {/* Daily Challenge Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>🔥</span> Daily Challenge
              </h3>
              <span className="rounded-lg bg-[var(--color-warning)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--color-warning)]">
                +{DAILY_CHALLENGE.xpReward} XP
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#c4cad8] mb-4">
              {DAILY_CHALLENGE.question}
            </p>

            <div className="space-y-2">
              {DAILY_CHALLENGE.options.map((opt) => {
                const isSelected = selectedOpt === opt.id
                const isCorrect = opt.id === DAILY_CHALLENGE.correctId
                let classes = 'border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)]'
                
                if (challengeAnswered) {
                  if (isCorrect) {
                    classes = 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-white'
                  } else if (isSelected) {
                    classes = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[#f87171]'
                  } else {
                    classes = 'border-[var(--color-border)] opacity-60'
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={challengeAnswered}
                    onClick={() => handleAnswerChallenge(opt.id)}
                    className={`w-full rounded-xl border p-3 text-left text-xs leading-relaxed transition-all ${classes}`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {challengeAnswered && (
              <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-xs leading-relaxed text-[#8b93a7]">
                {challengeStatus === 'correct' ? (
                  <span className="text-[var(--color-success)] font-semibold block mb-1">✓ Correct! Earned +50 XP</span>
                ) : (
                  <span className="text-[var(--color-danger)] font-semibold block mb-1">✕ Incorrect answer</span>
                )}
                {DAILY_CHALLENGE.explanation}
              </div>
            )}
          </div>

          {/* Gamified Achievements List */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <span>🏆</span> Achievements
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 text-lg">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-bold">First Step</h4>
                  <p className="text-[10px] text-[#8b93a7] mt-0.5">Complete your first interactive lesson.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-lg">
                  🔥
                </div>
                <div>
                  <h4 className="text-xs font-bold">Continuous Learner</h4>
                  <p className="text-[10px] text-[#8b93a7] mt-0.5">Keep a learning streak active.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-lg">
                  🧠
                </div>
                <div>
                  <h4 className="text-xs font-bold">Concept Master</h4>
                  <p className="text-[10px] text-[#8b93a7] mt-0.5">Complete all foundations with zero errors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {lockedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 text-center shadow-2xl relative">
            <button 
              onClick={() => setLockedLesson(null)} 
              className="absolute top-4 right-4 text-[#8b93a7] hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <span className="text-5xl block mb-4">🔒</span>
            <h3 className="text-xl font-bold text-white mb-2">{lockedLesson}</h3>
            <p className="text-xs text-[#8b93a7] leading-relaxed mb-6">
              This advanced portfolio project is reserved for premium subscribers. It unlocks visual modeling sandboxes, direct interview recruiter mock runs, and automatic Git push configurations!
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => alert("Monetization and subscriptions are launching soon! Administrators can access all modules now.")} 
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-xs font-bold text-black transition-all"
              >
                Unlock Premium
              </button>
              <button 
                onClick={() => setLockedLesson(null)} 
                className="w-full rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] py-3 text-xs font-bold text-[#8b93a7] transition-all"
              >
                Keep Exploring Free Modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
