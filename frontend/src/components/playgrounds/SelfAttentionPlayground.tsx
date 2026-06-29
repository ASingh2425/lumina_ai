import { useState } from 'react'

interface SentenceData {
  id: number
  text: string
  tokens: string[]
  // Map of token index to array of weights connecting to other tokens
  attentionMap: Record<number, number[]>
}

const DATASETS: SentenceData[] = [
  {
    id: 1,
    text: "The animal did not cross the street because it was too tired.",
    tokens: ["The", "animal", "did", "not", "cross", "the", "street", "because", "it", "was", "too", "tired", "."],
    attentionMap: {
      // "it" (index 8) points strongly to "animal" (index 1)
      8: [0.02, 0.72, 0.01, 0.01, 0.03, 0.02, 0.08, 0.02, 0.01, 0.02, 0.01, 0.05, 0.0],
      // "tired" (index 11) points to "animal" (index 1)
      11: [0.01, 0.64, 0.02, 0.01, 0.05, 0.01, 0.02, 0.03, 0.15, 0.02, 0.03, 0.01, 0.0]
    }
  },
  {
    id: 2,
    text: "The animal did not cross the street because it was too wide.",
    tokens: ["The", "animal", "did", "not", "cross", "the", "street", "because", "it", "was", "too", "wide", "."],
    attentionMap: {
      // "it" (index 8) points strongly to "street" (index 6)
      8: [0.02, 0.06, 0.01, 0.01, 0.04, 0.02, 0.68, 0.02, 0.01, 0.02, 0.01, 0.1, 0.0],
      // "wide" (index 11) points to "street" (index 6)
      11: [0.01, 0.03, 0.02, 0.01, 0.05, 0.01, 0.62, 0.03, 0.12, 0.02, 0.03, 0.06, 0.0]
    }
  }
]

export function SelfAttentionPlayground() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(8)

  const currentDataset = DATASETS[selectedIdx]
  const attentionWeights = hoveredTokenIdx !== null && currentDataset.attentionMap[hoveredTokenIdx]
    ? currentDataset.attentionMap[hoveredTokenIdx]
    : null

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 font-sans select-none">
      
      {/* Selector tab */}
      <div className="flex flex-wrap gap-2 justify-between border-b border-[var(--color-border)] pb-3 mb-4 items-center">
        <span className="text-sm text-[#8b93a7]">Transformer Self-Attention Mapping</span>
        <div className="flex gap-1.5">
          {DATASETS.map((d, idx) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSelectedIdx(idx)
                setHoveredTokenIdx(8) // default hover on "it"
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedIdx === idx
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] hover:text-white'
              }`}
            >
              Sentence {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Narrative Sentence view */}
      <div className="my-6 text-center">
        <p className="text-sm italic text-[#8b93a7] mb-4">
          &ldquo;{currentDataset.text}&rdquo;
        </p>

        {/* Dynamic Token Link Map Grid */}
        <div className="flex flex-wrap justify-center gap-1.5 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] relative min-h-[140px]">
          
          {/* Connector lines drawer overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw curve lines from hovered token index to all other tokens if weights exist */}
            {hoveredTokenIdx !== null && attentionWeights && (
              currentDataset.tokens.map((_, idx) => {
                const weight = attentionWeights[idx]
                if (weight < 0.05) return null // ignore tiny links

                // Approximate horizontal center positions for nodes in UI
                // Standard calculations based on token cells
                const startX = 60 + (hoveredTokenIdx * 32)
                const endX = 60 + (idx * 32)

                return (
                  <path
                    key={idx}
                    d={`M ${startX % 260},30 Q ${(startX % 260 + endX % 260) / 2},120 ${endX % 260},30`}
                    fill="none"
                    stroke={weight > 0.5 ? 'var(--color-success)' : 'var(--color-accent-bright)'}
                    strokeWidth={weight * 6}
                    opacity={0.3 + weight * 0.7}
                  />
                )
              })
            )}
          </svg>

          {/* Tokens row */}
          <div className="flex flex-wrap justify-center gap-2 z-10">
            {currentDataset.tokens.map((token, idx) => {
              const isHovered = hoveredTokenIdx === idx
              const weight = attentionWeights ? attentionWeights[idx] : 0
              const isStrongLink = weight > 0.5

              return (
                <div
                  key={idx}
                  onMouseEnter={() => {
                    // Only support hover connections on tokens with mapped weights (e.g. "it" and end word)
                    if (currentDataset.attentionMap[idx]) {
                      setHoveredTokenIdx(idx)
                    }
                  }}
                  className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-all duration-300 ${
                    isHovered
                      ? 'bg-[var(--color-accent)] border border-white text-white cursor-pointer'
                      : isStrongLink
                        ? 'border border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)] cursor-help'
                        : 'border border-[var(--color-border)] bg-[var(--color-surface-overlay)] text-[#8b93a7]'
                  }`}
                  title={weight ? `Attention link: ${(weight * 100).toFixed(0)}%` : undefined}
                >
                  {token}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Softmax / Similarity breakdown */}
      {hoveredTokenIdx !== null && attentionWeights && (
        <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-3">
          <div className="rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border)] p-4 text-xs leading-relaxed text-[#c4cad8] font-mono">
            <span className="text-white font-bold block mb-1">Attention Weight Math</span>
            Hovered Token: <span className="text-white font-bold">&ldquo;{currentDataset.tokens[hoveredTokenIdx]}&rdquo;</span>
            <br />
            Key associations:
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#8b93a7]">
              {currentDataset.tokens.map((tok, idx) => {
                const w = attentionWeights[idx]
                if (w < 0.05) return null
                return (
                  <li key={idx}>
                    Weight with <span className="text-white font-semibold">&ldquo;{tok}&rdquo;</span>: <span className="text-amber-400 font-bold">{(w * 100).toFixed(0)}%</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <p className="text-xs text-[#8b93a7] leading-relaxed">
            💡 <strong>Contextual Ambiguity:</strong> In sentence 1, <code>"it"</code> refers to the <code>"animal"</code> (which was tired). In sentence 2, <code>"it"</code> refers to the <code>"street"</code> (which was wide). Notice how the self-attention weights shift automatically depending on the ending adjective to resolve the pronoun context!
          </p>
        </div>
      )}
    </div>
  )
}
