import { useState, useMemo } from 'react'

interface InterviewQuestion {
  id: string
  question: string
  options: {
    id: string
    label: string
    isCorrect: boolean
    explanation: string
    keywords: string[]
    recruiterComment: string
  }[]
}

const QUESTIONS: Record<string, InterviewQuestion> = {
  'gradient-descent': {
    id: 'gd-interview',
    question: "When optimizing model parameters, how do you decide between using L1 (Lasso) and L2 (Ridge) regularization?",
    options: [
      {
        id: 'a',
        label: "L1 (Lasso) penalizes absolute weights, causing coefficients to shrink to exactly zero (creating sparsity). Use it for feature selection. L2 (Ridge) penalizes squared weights, shrinking parameters uniformly without throwing them out; use it when features are highly correlated.",
        isCorrect: true,
        keywords: ['Sparsity', 'Feature Selection', 'L1 absolute penalty', 'Correlated features'],
        recruiterComment: "Spot on! You hit all the keywords: sparsity, feature selection, and correlation behavior. Excellent explanation of why L1 acts like Marie Kondo and throws out unneeded parameters.",
        explanation: "L1 uses the absolute value of weights, which forces some coefficients to reach exactly zero. L2 uses squared weights, which shrinks coefficients but keeps all of them, making it ideal for collinearity."
      },
      {
        id: 'b',
        label: "L1 is always faster to calculate because it avoids squares. L2 is only used for very small datasets where overfitting is easy.",
        isCorrect: false,
        keywords: [],
        recruiterComment: "That's incorrect. Both regularization techniques scale well. L1's absolute derivative is actually harder to compute at zero because of the absolute value corner. Let's study mathematical optimization thresholds.",
        explanation: "Both regularization techniques are widely used across large datasets. The choice is determined by sparsity needs, not compute limits."
      }
    ]
  },
  'rag-pipeline': {
    id: 'rag-interview',
    question: "Why does context pollution occur in Retrieval-Augmented Generation (RAG), and how do you configure similarity thresholds to solve it?",
    options: [
      {
        id: 'a',
        label: "Context pollution happens when the vector retrieval threshold is set too low, injecting irrelevant document facts into the LLM prompt. Setting a higher cosine similarity threshold filters out low-matching noise, though setting it too high might cause missing facts.",
        isCorrect: true,
        keywords: ['Context pollution', 'Cosine similarity threshold', 'Irrelevant facts', 'Prompt context'],
        recruiterComment: "Great! You understand vector retrieval limits. You correctly described the tradeoffs of prompt noise vs. information loss.",
        explanation: "Retrieval thresholds control the similarity cutoffs. Low thresholds retrieve distant neighbor facts, which adds noise and confuses LLM attention."
      },
      {
        id: 'b',
        label: "Prompt pollution is caused by the LLM memorizing too many user questions. We reset similarity thresholds to zero to force the LLM to search the internet.",
        isCorrect: false,
        keywords: [],
        recruiterComment: "Not quite. RAG databases are local indices, and resets to zero would retrieve everything, causing prompt limits to break. Let's review the RAG retrieval pipeline.",
        explanation: "RAG uses local vector embeddings. Resttings to zero retrieves all documents, causing maximum noise."
      }
    ]
  },
  'tokenizer': {
    id: 'tok-interview',
    question: "How does Byte-Pair Encoding (BPE) prevent 'Out of Vocabulary' (OOV) errors during LLM inference?",
    options: [
      {
        id: 'a',
        label: "BPE uses a base vocabulary of individual characters. When it encounters a new, unseen word, it splits it into smaller subword chunks or base characters present in its vocabulary, rather than throwing a lookup error.",
        isCorrect: true,
        keywords: ['Subword tokens', 'Base vocabulary characters', 'Out of Vocabulary', 'Splicing'],
        recruiterComment: "Excellent! You explained how subwords act as safety fallback layers for vocabulary lookups. This is the cornerstone of modern LLMs.",
        explanation: "BPE ensures all words can be tokenized by falling back to base characters or syllables if the full word token is missing from the trained vocabulary."
      },
      {
        id: 'b',
        label: "BPE translates any unseen words into English first, or replaces them with a special [MASK] token to skip processing them.",
        isCorrect: false,
        keywords: [],
        recruiterComment: "Incorrect. BPE does not perform translation or masking at the tokenizer level for OOV. It simply decomposes inputs. Let's check subword merges.",
        explanation: "Tokenizers operate before LLM processing, so they cannot translate. They decompose unseen words into known base character blocks."
      }
    ]
  }
}

interface InterviewPlaygroundProps {
  topic?: string // 'gradient-descent', 'rag-pipeline', 'tokenizer'
}

export function InterviewPlayground({ topic = 'gradient-descent' }: InterviewPlaygroundProps) {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [answered, setAnswered] = useState<boolean>(false)

  const activeQuestion = QUESTIONS[topic] || QUESTIONS['gradient-descent']
  const activeOpt = useMemo(() => {
    return activeQuestion.options.find((o) => o.id === selectedOpt) || null
  }, [selectedOpt, activeQuestion])

  const handleReset = () => {
    setSelectedOpt(null)
    setAnswered(false)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 select-none font-sans">
      
      {/* Recruiter Avatar block */}
      <div className="flex items-center gap-3.5 border-b border-[var(--color-border)] pb-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-xl border-2 border-indigo-400">
          🧑‍💼
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">AI Technical Recruiter</h3>
          <span className="text-[10px] text-[#8b93a7] font-semibold uppercase tracking-wider">FAANG Hiring Panel</span>
        </div>
      </div>

      {/* Recruiter Dialogue Question */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-5 text-sm leading-relaxed text-[#e2e8f0]">
        &ldquo;{activeQuestion.question}&rdquo;
      </div>

      {/* Option blocks */}
      <div className="space-y-3">
        {activeQuestion.options.map((opt) => {
          const isSelected = selectedOpt === opt.id
          let borderStyle = 'border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] hover:border-[var(--color-accent)]/50'
          
          if (answered) {
            if (opt.isCorrect) {
              borderStyle = 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-white'
            } else if (isSelected) {
              borderStyle = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[#f87171]'
            } else {
              borderStyle = 'border-[var(--color-border)] opacity-50'
            }
          } else if (isSelected) {
            borderStyle = 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={answered}
              onClick={() => setSelectedOpt(opt.id)}
              className={`w-full rounded-2xl border p-4 text-left text-xs leading-relaxed transition-all ${borderStyle}`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Action triggers */}
      <div className="mt-5 flex justify-end gap-2">
        {!answered ? (
          <button
            type="button"
            disabled={!selectedOpt}
            onClick={() => setAnswered(true)}
            className="rounded-xl bg-[var(--color-accent)] px-6 py-2.5 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            Submit Response
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-[var(--color-border)] px-6 py-2.5 text-xs font-semibold text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)]"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Graded recruiter feedback scorecard */}
      {answered && activeOpt && (
        <div className="mt-5 border-t border-[var(--color-border)] pt-4 space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="text-[10px] text-[#8b93a7] font-bold uppercase tracking-wider block mb-3">Recruiter Review Scorecard</span>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-[var(--color-surface-raised)] p-3 text-center border border-[var(--color-border)]">
                <span className="text-[9px] text-[#8b93a7] font-semibold block">Decision Accuracy</span>
                <span className={`text-lg font-bold ${activeOpt.isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                  {activeOpt.isCorrect ? '100% (Pass)' : '0% (Fail)'}
                </span>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-raised)] p-3 text-center border border-[var(--color-border)]">
                <span className="text-[9px] text-[#8b93a7] font-semibold block">Keywords Matched</span>
                <span className="text-sm font-bold text-white">{activeOpt.keywords.length} matches</span>
              </div>
            </div>

            {/* Keyword tags */}
            {activeOpt.keywords.length > 0 && (
              <div className="mb-4">
                <span className="text-[9px] text-[#8b93a7] font-bold uppercase tracking-wider block mb-1.5">Industry Keywords Picked:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeOpt.keywords.map((k) => (
                    <span key={k} className="rounded-lg bg-indigo-500/15 px-2 py-0.5 text-[9px] font-bold text-indigo-300 border border-indigo-500/10">
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="text-xs leading-relaxed text-[#c4cad8]">
              <span className="text-white font-bold block mb-1">Feedback:</span>
              &ldquo;{activeOpt.recruiterComment}&rdquo;
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
