import type { Lesson } from '../types/lesson'

interface HomePageProps {
  lessons: Lesson[]
  onSelectLesson: (id: string) => void
  isLessonComplete: (id: string) => boolean
}

export function HomePage({ lessons, onSelectLesson, isLessonComplete }: HomePageProps) {
  const modules = [...new Set(lessons.map((l) => l.module))]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Learn AI by <span className="text-[var(--color-accent-bright)]">understanding</span>
        </h1>
        <p className="mt-3 max-w-xl text-[#8b93a7] leading-relaxed">
          Don't memorize formulas. Drag, experiment, and watch algorithms behave — then truly get why they work.
        </p>
      </section>

      {modules.map((module) => (
        <section key={module} className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#8b93a7]">
            {module}
          </h2>
          <div className="space-y-3">
            {lessons
              .filter((l) => l.module === module)
              .map((lesson) => {
                const done = isLessonComplete(lesson.id)
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onSelectLesson(lesson.id)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 text-left transition-colors hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-overlay)]"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${
                        done
                          ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                          : 'bg-[var(--color-accent)]/20 text-[var(--color-accent-bright)]'
                      }`}
                    >
                      {done ? '✓' : '→'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold group-hover:text-[var(--color-accent-bright)]">
                        {lesson.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#8b93a7] line-clamp-2">{lesson.description}</p>
                    </div>
                    <div className="shrink-0 text-sm font-medium text-[var(--color-warning)]">
                      +{lesson.xpReward} XP
                    </div>
                  </button>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
