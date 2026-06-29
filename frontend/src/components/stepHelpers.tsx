import { useState } from 'react'
import type { MathPart } from '../types/lesson'

function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i} className="mb-3 last:mb-0 leading-relaxed text-[#c4cad8]">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return <span key={j}>{part}</span>
        })}
      </p>
    )
  })
}

export function MathStepContent({
  content,
  mathParts,
  formula,
}: {
  content?: string
  mathParts: MathPart[]
  formula?: string
}) {
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null)
  const active = mathParts.find((p) => p.symbol === activeSymbol)

  return (
    <div>
      {content && <div className="mb-6">{renderMarkdown(content)}</div>}
      {formula && (
        <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 text-center">
          <p className="font-mono text-2xl tracking-wide text-[var(--color-accent-bright)]">
            {formula}
          </p>
        </div>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {mathParts.map((part) => (
          <button
            key={part.symbol}
            type="button"
            onClick={() => setActiveSymbol(part.symbol)}
            className={`rounded-xl border px-4 py-2 font-mono text-lg transition-colors ${
              activeSymbol === part.symbol
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/20 text-white'
                : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)]/50'
            }`}
          >
            {part.symbol}
          </button>
        ))}
      </div>
      {active && (
        <p className="mt-4 rounded-xl bg-[var(--color-surface-overlay)] px-4 py-3 text-sm leading-relaxed text-[#c4cad8]">
          <strong className="text-white">{active.symbol}</strong> — {active.explanation}
        </p>
      )}
    </div>
  )
}

export function MarkdownContent({ text }: { text: string }) {
  return <>{renderMarkdown(text)}</>
}
