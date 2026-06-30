import { useState, useMemo } from 'react'
import { getFlashcardsForWorld } from '../data/lessons'

interface FlashcardViewerProps {
  worldId: string
  onClose: () => void
}

export function FlashcardViewer({ worldId, onClose }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  
  const flashcards = useMemo(() => getFlashcardsForWorld(worldId), [worldId])
  
  if (flashcards.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-[var(--color-surface)] p-8 rounded-2xl text-center max-w-sm w-full">
          <p className="text-[#94a3b8] mb-6">No flashcards found for this world yet.</p>
          <button onClick={onClose} className="px-6 py-2 bg-[var(--color-accent)] rounded-xl text-white font-bold">Close</button>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  const nextCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }, 150) // wait for flip back animation
  }

  const prevCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }, 150)
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#050B14]/90 backdrop-blur-md p-4">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-[#94a3b8] hover:text-white bg-[var(--color-surface-raised)] rounded-full p-2"
      >
        ✕ Close
      </button>

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Revision Flashcards</h2>
        <p className="text-sm text-[var(--color-accent)]">{currentIndex + 1} / {flashcards.length}</p>
      </div>

      {/* 3D Flip Container */}
      <div 
        className="relative w-full max-w-md h-64 perspective-1000 cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-2xl flex flex-col items-center justify-center text-center">
            <span className="absolute top-4 left-4 text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Question</span>
            <p className="text-xl font-medium text-white">{currentCard.front}</p>
            <p className="absolute bottom-4 text-xs text-[#94a3b8]">Click to flip</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl border border-[var(--color-accent)] bg-gradient-to-br from-[var(--color-surface)] to-[#0f172a] p-8 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col items-center justify-center text-center rotate-y-180">
            <span className="absolute top-4 left-4 text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest">Answer</span>
            <p className="text-lg text-white leading-relaxed">{currentCard.back}</p>
          </div>

        </div>
      </div>

      <div className="flex gap-4 mt-12">
        <button 
          onClick={prevCard}
          className="rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] w-12 h-12 flex items-center justify-center text-white hover:bg-[var(--color-surface-overlay)] transition-colors"
        >
          ←
        </button>
        <button 
          onClick={nextCard}
          className="rounded-full bg-[var(--color-accent)] w-12 h-12 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
        >
          →
        </button>
      </div>
    </div>
  )
}
