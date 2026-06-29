import { useState } from 'react'
import { useAskWhy } from '../hooks/useAskWhy'

interface AskWhyPanelProps {
  context: string
  suggestions?: string[]
}

const DEFAULT_SUGGESTIONS = [
  'Why are we squaring the error?',
  'What happens if learning rate is too high?',
  'Why does the ball oscillate?',
]

export function AskWhyPanel({ context, suggestions = DEFAULT_SUGGESTIONS }: AskWhyPanelProps) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const { ask, answer, loading, level, setLevel } = useAskWhy(context)

  const handleAsk = () => {
    if (!question.trim()) return
    ask(question.trim())
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent)]/25 transition-transform hover:scale-105 active:scale-95"
      >
        <span>💡</span> Ask Why
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex w-[min(400px,calc(100vw-2rem))] flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-overlay)] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <h3 className="font-semibold">Ask Why</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-2 py-1 text-[#8b93a7] hover:bg-[var(--color-surface-raised)] hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pt-3">
        {(['age_10', 'beginner', 'college', 'interview', 'mathematical'] as const).map((l) => {
          const labels: Record<string, string> = {
            age_10: 'Age 10',
            beginner: 'Beginner',
            college: 'College',
            interview: 'Interview',
            mathematical: 'Math',
          }
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                level === l
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-raised)] text-[#8b93a7] hover:text-white'
              }`}
            >
              {labels[l]}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-3">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuestion(s)
              ask(s)
            }}
            className="rounded-lg bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[#a8b0c4] transition-colors hover:bg-[var(--color-border)] hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="px-4 pb-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Why does this happen?"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="w-full rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </div>

      {answer && (
        <div className="border-t border-[var(--color-border)] px-4 py-3 text-sm leading-relaxed text-[#c4cad8]">
          {answer}
        </div>
      )}
    </div>
  )
}
