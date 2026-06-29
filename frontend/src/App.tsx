import { useState } from 'react'
import { Header } from './components/Header'
import { LessonShell } from './components/LessonShell'
import { HomePage } from './pages/HomePage'
import { lessons, getLesson } from './data/lessons'
import { useProgress } from './hooks/useProgress'

function App() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const { progress, completeStep, completeLesson, isStepComplete, isLessonComplete } = useProgress()

  const activeLesson = activeLessonId ? getLesson(activeLessonId) : null

  const goHome = () => {
    setActiveLessonId(null)
    setStepIndex(0)
  }

  const selectLesson = (id: string) => {
    setActiveLessonId(id)
    setStepIndex(0)
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Header xp={progress.xp} streak={progress.streak} onHome={goHome} />

      {activeLesson ? (
        <LessonShell
          lesson={activeLesson}
          currentStepIndex={stepIndex}
          onStepChange={setStepIndex}
          onCompleteStep={(stepId, xp) => completeStep(activeLesson.id, stepId, xp)}
          onCompleteLesson={() => completeLesson(activeLesson.id, activeLesson.xpReward)}
          onBack={goHome}
          isStepComplete={(stepId) => isStepComplete(activeLesson.id, stepId)}
        />
      ) : (
        <HomePage
          lessons={lessons}
          onSelectLesson={selectLesson}
          isLessonComplete={isLessonComplete}
        />
      )}
    </div>
  )
}

export default App
