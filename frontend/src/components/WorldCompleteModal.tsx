import { useState } from 'react'
import { FlashcardViewer } from './FlashcardViewer'

interface WorldCompleteModalProps {
  worldId: string
  onClose: () => void
  onTakeAssessment: () => void
}

export function WorldCompleteModal({ worldId, onClose, onTakeAssessment }: WorldCompleteModalProps) {
  const [showFlashcards, setShowFlashcards] = useState(false)

  if (showFlashcards) {
    return <FlashcardViewer worldId={worldId} onClose={() => setShowFlashcards(false)} />
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-2xl animate-fade-in relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[var(--color-accent)] opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            <span className="text-4xl">🏆</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-[#94a3b8] mb-8">
            You've successfully conquered all modules in <strong className="text-white">{worldId.replace('-', ' ').toUpperCase()}</strong>.
            You've unlocked the ultimate capstone and expanded your AI skills!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowFlashcards(true)}
              className="w-full rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] px-4 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-surface-overlay)] hover:border-[var(--color-accent)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎴</span>
                <span>Revise with Flashcards</span>
              </div>
              <span className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">Review →</span>
            </button>

            <button
              onClick={onTakeAssessment}
              className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02] flex items-center justify-between"
            >
               <div className="flex items-center gap-3">
                <span className="text-xl">📝</span>
                <span>Take Scenario Assessment</span>
              </div>
              <span>Start →</span>
            </button>

            <button
              onClick={onClose}
              className="mt-4 w-full text-xs text-[#94a3b8] hover:text-white transition-colors"
            >
              Skip for now, return to home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
