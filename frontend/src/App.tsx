import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { LessonShell } from './components/LessonShell'
import { HomePage } from './pages/HomePage'
import { lessons, getLesson } from './data/lessons'
import { useProgress } from './hooks/useProgress'
import { AuthPages } from './pages/AuthPages'
import { AdminPortal } from './pages/AdminPortal'
import { WorldCompleteModal } from './components/WorldCompleteModal'
import { AssessmentView } from './components/AssessmentView'

function App() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(() => localStorage.getItem('activeLessonId'))
  const [activeWorldId, setActiveWorldId] = useState<string | null>(() => localStorage.getItem('activeWorldId'))
  const [stepIndex, setStepIndex] = useState<number>(() => {
    const raw = localStorage.getItem('stepIndex')
    return raw ? parseInt(raw, 10) : 0
  })
  
  const [completedWorldId, setCompletedWorldId] = useState<string | null>(null)
  const [takingAssessmentFor, setTakingAssessmentFor] = useState<string | null>(null)

  const { progress, completeStep, completeLesson, isStepComplete, isLessonComplete } = useProgress()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (activeLessonId) {
      localStorage.setItem('activeLessonId', activeLessonId)
    } else {
      localStorage.removeItem('activeLessonId')
    }
  }, [activeLessonId])

  useEffect(() => {
    if (activeWorldId) {
      localStorage.setItem('activeWorldId', activeWorldId)
    } else {
      localStorage.removeItem('activeWorldId')
    }
  }, [activeWorldId])

  useEffect(() => {
    localStorage.setItem('stepIndex', stepIndex.toString())
  }, [stepIndex])

  // Routing checks
  const isAuthenticated = !!localStorage.getItem('token')
  const isAddressAdmin = currentPath === '/admin'

  if (!isAuthenticated) {
    return <AuthPages />
  }

  if (isAddressAdmin) {
    return <AdminPortal />
  }

  const activeLesson = activeLessonId ? getLesson(activeLessonId) : null

  const goHome = () => {
    setActiveLessonId(null)
    setActiveWorldId(null)
    setStepIndex(0)
    window.history.pushState(null, '', '/')
    window.dispatchEvent(new Event('popstate'))
  }

  const handleCompleteLesson = () => {
    if (!activeLesson) return
    completeLesson(activeLesson.id, activeLesson.xpReward)
    
    // Check if this was the last lesson in the world
    const worldLessons = lessons.filter(l => l.worldId === activeLesson.worldId)
    const currentIndex = worldLessons.findIndex(l => l.id === activeLesson.id)
    
    if (currentIndex === worldLessons.length - 1) {
      setCompletedWorldId(activeLesson.worldId ?? null)
    } else {
      goHome()
    }
  }

  const selectLesson = (id: string) => {
    setActiveLessonId(id)
    setStepIndex(0)
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Header xp={progress.xp} streak={progress.streak} onHome={goHome} />

      {takingAssessmentFor && (
        <AssessmentView 
          worldId={takingAssessmentFor} 
          onClose={() => setTakingAssessmentFor(null)}
          onComplete={(score, total) => {
             alert(`You scored ${score} out of ${total}!`)
             setTakingAssessmentFor(null)
          }}
        />
      )}

      {completedWorldId && (
        <WorldCompleteModal 
          worldId={completedWorldId} 
          onClose={() => { setCompletedWorldId(null); goHome(); }} 
          onTakeAssessment={() => { setTakingAssessmentFor(completedWorldId as string); setCompletedWorldId(null); goHome(); }}
        />
      )}

      {activeLesson ? (
        <LessonShell
          lesson={activeLesson}
          currentStepIndex={stepIndex}
          onStepChange={setStepIndex}
          onCompleteStep={(stepId, xp) => completeStep(activeLesson.id, stepId, xp)}
          onCompleteLesson={handleCompleteLesson}
          onBack={goHome}
          isStepComplete={(stepId) => isStepComplete(activeLesson.id, stepId)}
        />
      ) : (
        <HomePage
          lessons={lessons}
          onSelectLesson={selectLesson}
          isLessonComplete={isLessonComplete}
          activeWorldId={activeWorldId}
          setActiveWorldId={setActiveWorldId}
        />
      )}
    </div>
  )
}

export default App
