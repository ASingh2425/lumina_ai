import type { Lesson } from '../types/lesson'
import { StepContent } from './StepContent'
import { AskWhyPanel } from './AskWhyPanel'

const STEP_LABELS: Record<string, string> = {
  story: 'Story',
  visual: 'Visual',
  experiment: 'Experiment',
  math: 'Math',
  code: 'Code',
  quiz: 'Quiz',
  sandbox: 'Sandbox',
}

interface LessonShellProps {
  lesson: Lesson
  currentStepIndex: number
  onStepChange: (index: number) => void
  onCompleteStep: (stepId: string, xp: number) => void
  onCompleteLesson: () => void
  onBack: () => void
  isStepComplete: (stepId: string) => boolean
}

export function LessonShell({
  lesson,
  currentStepIndex,
  onStepChange,
  onCompleteStep,
  onCompleteLesson,
  onBack,
  isStepComplete,
}: LessonShellProps) {
  const step = lesson.steps[currentStepIndex]
  const isLast = currentStepIndex === lesson.steps.length - 1
  const progressPct = ((currentStepIndex + 1) / lesson.steps.length) * 100

  const handleContinue = () => {
    const stepXp = step.type === 'quiz' ? 25 : 15
    if (!isStepComplete(step.id)) {
      onCompleteStep(step.id, stepXp)
    }

    if (isLast) {
      onCompleteLesson()
      onBack()
    } else {
      onStepChange(currentStepIndex + 1)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-[#8b93a7] transition-colors hover:text-white"
      >
        ← Back to lessons
      </button>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--color-accent-bright)]">
        {lesson.module}
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 rounded-full bg-[var(--color-surface-raised)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {lesson.steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onStepChange(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              i === currentStepIndex
                ? 'bg-[var(--color-accent)] text-white'
                : isStepComplete(s.id)
                  ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                  : 'bg-[var(--color-surface-raised)] text-[#8b93a7] hover:text-white'
            }`}
          >
            {STEP_LABELS[s.type] ?? s.type}
          </button>
        ))}
      </div>

      {/* Step content card */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-lg bg-[var(--color-surface-overlay)] px-2.5 py-1 text-xs font-medium text-[#8b93a7]">
            {STEP_LABELS[step.type]}
          </span>
          <h2 className="text-lg font-semibold">{step.title}</h2>
        </div>

        <StepContent
          step={step}
          onQuizCorrect={() => {
            if (!isStepComplete(step.id)) onCompleteStep(step.id, 25)
          }}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="rounded-xl bg-[var(--color-accent)] px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLast ? 'Complete lesson ✓' : 'Continue →'}
        </button>
      </div>

      <AskWhyPanel context={`${lesson.title}: ${step.title}`} />
    </div>
  )
}
