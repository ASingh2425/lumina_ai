import { useState, useMemo } from 'react'
import { getAssessmentForWorld } from '../data/lessons'

interface AssessmentViewProps {
  worldId: string
  onClose: () => void
  onComplete: (score: number, total: number) => void
}

export function AssessmentView({ worldId, onClose, onComplete }: AssessmentViewProps) {
  const assessment = useMemo(() => getAssessmentForWorld(worldId), [worldId])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)

  if (!assessment || assessment.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-[var(--color-surface)] p-8 rounded-2xl text-center max-w-sm w-full">
          <p className="text-[#94a3b8] mb-6">No assessment found for this world yet.</p>
          <button onClick={onClose} className="px-6 py-2 bg-[var(--color-accent)] rounded-xl text-white font-bold">Close</button>
        </div>
      </div>
    )
  }

  const q = assessment[currentQIndex]
  const answered = selectedOpt !== null
  const isCorrect = selectedOpt === q.correctId

  const handleNext = () => {
    if (isCorrect) setScore(s => s + 1)
    
    if (currentQIndex === assessment.length - 1) {
      onComplete(score + (isCorrect ? 1 : 0), assessment.length)
    } else {
      setSelectedOpt(null)
      setShowExplanation(false)
      setCurrentQIndex(i => i + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-surface)] overflow-y-auto">
      <div className="sticky top-0 bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-border)] p-4 flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-white">World Assessment</h2>
        <div className="text-sm font-bold text-[var(--color-accent)]">Question {currentQIndex + 1} of {assessment.length}</div>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-white">✕ Close</button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-6 mt-8">
        <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-8 shadow-xl">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-xs font-bold uppercase tracking-wider">
            Scenario
          </div>
          <p className="text-lg text-white font-medium mb-8 leading-relaxed">
            {q.prompt}
          </p>

          <div className="space-y-3">
            {q.options.map(opt => {
              const isSelected = selectedOpt === opt.id
              const isOptCorrect = opt.id === q.correctId
              
              let border = 'border-[var(--color-border)]'
              if (answered && isSelected && isOptCorrect) border = 'border-[var(--color-success)] bg-[var(--color-success)]/10'
              if (answered && isSelected && !isOptCorrect) border = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10'
              if (answered && !isSelected && isOptCorrect) border = 'border-[var(--color-success)]/50'

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedOpt(opt.id)
                    setShowExplanation(true)
                  }}
                  disabled={answered}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-colors hover:bg-[var(--color-surface-overlay)] ${border} disabled:cursor-default`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div className="mt-6 animate-fade-in">
              <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/20' : 'bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20'}`}>
                <p className={`font-bold text-sm mb-2 ${isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                  {isCorrect ? 'Excellent logic!' : 'Not quite right.'}
                </p>
                <p className="text-white text-sm leading-relaxed">{q.explanation}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
                >
                  {currentQIndex === assessment.length - 1 ? 'Finish Assessment' : 'Next Question →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
