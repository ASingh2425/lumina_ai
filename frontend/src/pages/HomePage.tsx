import { useState } from 'react'
import type { Lesson } from '../types/lesson'
import { WORLDS } from '../types/world'

interface HomePageProps {
  lessons: Lesson[]
  onSelectLesson: (id: string) => void
  isLessonComplete: (id: string) => boolean
  activeWorldId: string | null
  setActiveWorldId: (id: string | null) => void
}

// Daily Challenge dataset
const DAILY_CHALLENGE = {
  question: 'Which of the following is true about non-convex loss functions?',
  options: [
    { id: 'a', label: 'Gradient descent is guaranteed to find the global minimum.' },
    { id: 'b', label: 'Gradient descent can get stuck in local minima or saddle points.' },
    { id: 'c', label: 'They never have a gradient of zero.' },
    { id: 'd', label: 'They only occur in simple linear regression models.' },
  ],
  correctId: 'b',
  xpReward: 50,
  explanation: 'Non-convex functions contain multiple valleys (local minima) and flat regions (saddle points). Simple gradient descent follows the local slope and can easily get trapped, failing to reach the global minimum.',
}

type CategoryType = 'foundations' | 'machine-learning' | 'deep-learning-genai' | 'bonus-content'

export function HomePage({ 
  lessons, 
  onSelectLesson, 
  isLessonComplete,
  activeWorldId,
  setActiveWorldId
}: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('foundations')
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [challengeAnswered, setChallengeAnswered] = useState(false)
  const [challengeStatus, setChallengeStatus] = useState<'correct' | 'incorrect' | null>(null)
  const [lockedLesson, setLockedLesson] = useState<string | null>(null)
  const [lockedWorld, setLockedWorld] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const isAdmin = (() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return false
      const parsed = JSON.parse(raw)
      return !!parsed.is_admin
    } catch {
      return false
    }
  })()

  const handleAnswerChallenge = (optId: string) => {
    if (challengeAnswered) return
    setSelectedOpt(optId)
    setChallengeAnswered(true)
    if (optId === DAILY_CHALLENGE.correctId) {
      setChallengeStatus('correct')
    } else {
      setChallengeStatus('incorrect')
    }
  }

  // Find active world object
  const activeWorld = WORLDS.find((w) => w.id === activeWorldId)
  
  // Filter lessons belonging to the active world
  const worldLessons = lessons.filter((l) => l.worldId === activeWorldId)
  const worldModules = [...new Set(worldLessons.map((l) => l.module))]

  // Filter worlds by active category
  const filteredWorlds = WORLDS.filter((w) => w.category === activeCategory)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Welcome & Overview Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Learn AI by <span className="text-[var(--color-accent-bright)]">Understanding</span>
          </h1>
          <p className="mt-2 max-w-xl text-[#8b93a7] text-sm leading-relaxed">
            Welcome to the AI Learning Forest. Travel through the worlds, practice in interactive labs, and deploy live portfolio models.
          </p>
        </div>
        
        {/* Statistics Cards */}
        <div className="flex gap-3 shrink-0">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 text-center min-w-[90px]">
            <span className="text-xl">🌲</span>
            <span className="text-[10px] font-semibold text-[#8b93a7] mt-1">Level</span>
            <span className="text-sm font-bold text-white mt-0.5">Apprentice</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 text-center min-w-[90px]">
            <span className="text-xl">🎓</span>
            <span className="text-[10px] font-semibold text-[#8b93a7] mt-1">Lessons</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {lessons.filter((l) => isLessonComplete(l.id)).length} / {lessons.length}
            </span>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Worlds Map OR Lessons list */}
        <div className="lg:col-span-2 space-y-6">
          
          {!activeWorldId ? (
            /* --- WORLDS SELECTION PANEL --- */
            <div className="space-y-6">
              
              {/* Category Track Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-4">
                {[
                  { id: 'foundations', label: '1. Foundations' },
                  { id: 'machine-learning', label: '2. Core ML' },
                  { id: 'deep-learning-genai', label: '3. Deep Learning & GenAI' },
                  { id: 'bonus-content', label: '🛡️ Premium Bonus' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as CategoryType)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[var(--color-accent)] text-white shadow-lg'
                        : 'border border-[var(--color-border)] text-[#8b93a7] hover:bg-[var(--color-surface-overlay)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>🗺️</span> AI Worlds Map
                </h2>
                <span className="text-xs text-[#8b93a7]">Select a world to enter</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWorlds.map((world) => {
                  const worldIdLessons = lessons.filter((l) => l.worldId === world.id)
                  const completedCount = worldIdLessons.filter((l) => isLessonComplete(l.id)).length
                  const progressPct = worldIdLessons.length > 0 ? (completedCount / worldIdLessons.length) * 100 : 0
                  const isLocked = !!world.isPremium && !isAdmin

                  return (
                    <button
                      key={world.id}
                      onClick={() => {
                        if (isLocked) {
                          setLockedWorld(world.title)
                        } else {
                          setActiveWorldId(world.id)
                        }
                      }}
                      className={`relative overflow-hidden text-left rounded-3xl border p-6 bg-gradient-to-br ${world.color} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[190px] shadow-lg cursor-pointer`}
                    >
                      {/* Top Row: Icon and Title */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{world.icon}</span>
                          {isLocked && (
                            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                              Premium 🔒
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-white">{world.title}</h3>
                        <p className="text-xs font-semibold text-[#8b93a7] mt-0.5">{world.subtitle}</p>
                      </div>

                      {/* Bottom Row: Description & Progress */}
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="text-[11px] text-[#c4cad8] line-clamp-2 leading-relaxed mb-4">
                          {world.description}
                        </p>
                        
                        {worldIdLessons.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-[#8b93a7]">
                              <span>Progress</span>
                              <span>{completedCount} / {worldIdLessons.length} Modules</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-current rounded-full transition-all duration-500" 
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* --- MODULES/LESSONS DRILL DOWN VIEW --- */
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveWorldId(null)}
                  className="rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] px-3 py-1.5 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  ← Back to Map
                </button>
                <div className="min-w-0">
                  <h2 className="text-lg font-extrabold text-white truncate">{activeWorld?.title}</h2>
                  <p className="text-xs text-[#8b93a7]">{activeWorld?.subtitle}</p>
                </div>
              </div>

              {worldModules.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[var(--color-border)] p-12 text-center text-sm text-[#8b93a7]">
                  No lessons available in this world yet. We are building them!
                </div>
              ) : (
                <div className="space-y-8">
                  {worldModules.map((moduleName, modIdx) => {
                    const moduleLessons = worldLessons.filter((l) => l.module === moduleName)

                    return (
                      <div key={moduleName} className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-bright)] pl-1">
                          Module {modIdx + 1}: {moduleName}
                        </h3>
                        <div className="space-y-3">
                          {moduleLessons.map((lesson) => {
                            const done = isLessonComplete(lesson.id)
                            const isPremiumLocked = !!lesson.isPremium && !isAdmin

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => {
                                  if (isPremiumLocked) {
                                    setLockedLesson(lesson.title)
                                  } else {
                                    onSelectLesson(lesson.id)
                                  }
                                }}
                                className="group flex w-full items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-overlay)] cursor-pointer"
                              >
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                                    isPremiumLocked
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : done
                                        ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                                        : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] group-hover:bg-[var(--color-accent)]/20 group-hover:text-[var(--color-accent-bright)]'
                                  }`}
                                >
                                  {isPremiumLocked ? '🔒' : done ? '✓' : '→'}
                                </div>
                                
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-sm text-white group-hover:text-[var(--color-accent-bright)] flex items-center gap-2">
                                    {lesson.title}
                                    {lesson.isPremium && (
                                      <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                                        Premium
                                      </span>
                                    )}
                                  </h3>
                                  <p className="mt-1 text-xs text-[#8b93a7] line-clamp-2 leading-relaxed">{lesson.description}</p>
                                </div>

                                <div className="shrink-0 text-xs font-semibold text-[var(--color-warning)]">
                                  +{lesson.xpReward} XP
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Daily Challenge & Achievements */}
        <div className="space-y-6">
          
          {/* Daily Challenge Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>🔥</span> Daily Challenge
              </h3>
              <span className="rounded-lg bg-[var(--color-warning)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--color-warning)]">
                +{DAILY_CHALLENGE.xpReward} XP
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#c4cad8] mb-4">
              {DAILY_CHALLENGE.question}
            </p>

            <div className="space-y-2">
              {DAILY_CHALLENGE.options.map((opt) => {
                const isSelected = selectedOpt === opt.id
                const isCorrect = opt.id === DAILY_CHALLENGE.correctId
                let classes = 'border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] cursor-pointer text-white'
                
                if (challengeAnswered) {
                  if (isCorrect) {
                    classes = 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-white'
                  } else if (isSelected) {
                    classes = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[#f87171]'
                  } else {
                    classes = 'border-[var(--color-border)] opacity-60 text-gray-500'
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={challengeAnswered}
                    onClick={() => handleAnswerChallenge(opt.id)}
                    className={`w-full rounded-xl border p-3 text-left text-xs leading-relaxed transition-all ${classes}`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {challengeAnswered && (
              <div className="mt-4 rounded-xl bg-[var(--color-surface-overlay)] p-3.5 border border-[var(--color-border)] text-[11px] leading-relaxed text-[#8b93a7]">
                <strong className={challengeStatus === 'correct' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
                  {challengeStatus === 'correct' ? 'Correct Answer! ' : 'Incorrect. '}
                </strong>
                {DAILY_CHALLENGE.explanation}
              </div>
            )}
          </div>

          {/* Achievements Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
            <h3 className="font-bold text-sm text-white border-b border-[var(--color-border)] pb-3 mb-4 flex items-center gap-2">
              <span>🏆</span> Unlocked Badges
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 text-lg">
                  🌱
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">First Step</h4>
                  <p className="text-[10px] text-[#8b93a7] mt-0.5">Complete your first interactive lesson.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-lg">
                  🔥
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Continuous Learner</h4>
                  <p className="text-[10px] text-[#8b93a7] mt-0.5">Keep a learning streak active.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-lg">
                  🧠
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Concept Master</h4>
                  <p className="text-[10px] text-[#8b93a7] mt-0.5">Complete all foundations with zero errors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- PREMIUM LOCKED LESSON MODAL --- */}
      {lockedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 text-center shadow-2xl relative">
            <button 
              onClick={() => setLockedLesson(null)} 
              className="absolute top-4 right-4 text-[#8b93a7] hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
            <span className="text-5xl block mb-4">🔒</span>
            <h3 className="text-xl font-bold text-white mb-2">{lockedLesson}</h3>
            <p className="text-xs text-[#8b93a7] leading-relaxed mb-6">
              This advanced portfolio project is reserved for premium subscribers. It unlocks visual modeling sandboxes, direct interview recruiter mock runs, and automatic Git push configurations!
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setLockedLesson(null)
                  setShowPaymentModal(true)
                }}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-xs font-bold text-black transition-all cursor-pointer"
              >
                Unlock Premium
              </button>
              <button 
                onClick={() => setLockedLesson(null)} 
                className="w-full rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] py-3 text-xs font-bold text-[#8b93a7] transition-all cursor-pointer"
              >
                Keep Exploring Free Modules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PREMIUM LOCKED WORLD MODAL --- */}
      {lockedWorld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 text-center shadow-2xl relative">
            <button 
              onClick={() => setLockedWorld(null)} 
              className="absolute top-4 right-4 text-[#8b93a7] hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
            <span className="text-5xl block mb-4">🔒</span>
            <h3 className="text-xl font-bold text-white mb-2">{lockedWorld}</h3>
            <p className="text-xs text-[#8b93a7] leading-relaxed mb-6">
              This entire curriculum world is reserved for premium subscribers. Upgrade to unlock all advanced models, interactive algorithm rooms, and automated Git repositories integration!
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setLockedWorld(null)
                  setShowPaymentModal(true)
                }}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-xs font-bold text-black transition-all cursor-pointer"
              >
                Unlock Premium World
              </button>
              <button 
                onClick={() => setLockedWorld(null)} 
                className="w-full rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] py-3 text-xs font-bold text-[#8b93a7] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STRIPE-STYLE CREDIT CARD PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8 shadow-2xl relative space-y-6">
            <button 
              onClick={() => {
                if (!isProcessing) {
                  setShowPaymentModal(false)
                  setPaymentSuccess(false)
                }
              }} 
              className="absolute top-4 right-4 text-[#8b93a7] hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center">
              <h3 className="text-xl font-extrabold text-white">Unlock Premium Membership</h3>
              <p className="text-xs text-[#8b93a7] mt-1">Get immediate access to all worlds, labs, and code sandboxes.</p>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <span className="text-6xl block animate-bounce">🎉</span>
                <h4 className="text-lg font-bold text-emerald-400">Payment Successful!</h4>
                <p className="text-xs text-[#8b93a7] max-w-xs mx-auto leading-relaxed">
                  Welcome to Lumina Premium! Your account has been promoted. All advanced worlds and labs are now fully unlocked.
                </p>
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setPaymentSuccess(false)
                    window.location.reload() // Reload to instantly sync all dashboard locks!
                  }}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition-all cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visual Credit Card Mockup */}
                <div className="w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-6 flex flex-col justify-between shadow-xl relative text-white font-mono overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
                  
                  {/* Top card row */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Premium Member</span>
                      <div className="w-8 h-6 bg-amber-400/80 rounded-md border border-amber-500/20" /> {/* Chip */}
                    </div>
                    <span className="text-lg font-bold italic tracking-tight">Lumina</span>
                  </div>

                  {/* Card number row */}
                  <div className="text-base md:text-lg tracking-[0.2em] font-medium my-4 min-h-[24px]">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Bottom card row */}
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[7px] text-white/5 tracking-wider block">CARDHOLDER</span>
                      <span className="text-[10px] font-bold tracking-wide uppercase min-h-[15px] block">
                        {cardName || 'YOUR NAME'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7px] text-white/5 tracking-wider block">EXPIRES</span>
                      <span className="text-[10px] font-bold tracking-wide min-h-[15px] block">
                        {cardExpiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card input forms */}
                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8b93a7] uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      disabled={isProcessing}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[#0d0f14] p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8b93a7] uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      value={cardNumber}
                      maxLength={19}
                      onChange={(e) => {
                        // Format card numbers with spaces
                        const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
                        setCardNumber(val)
                      }}
                      disabled={isProcessing}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[#0d0f14] p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b93a7] uppercase tracking-wider">Expires</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        maxLength={5}
                        onChange={(e) => {
                          let val = e.target.value
                          if (val.length === 2 && !val.includes('/')) {
                            val += '/'
                          }
                          setCardExpiry(val)
                        }}
                        disabled={isProcessing}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[#0d0f14] p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b93a7] uppercase tracking-wider">CVC Code</label>
                      <input
                        type="password"
                        placeholder="***"
                        value={cardCvc}
                        maxLength={3}
                        onChange={(e) => setCardCvc(e.target.value)}
                        disabled={isProcessing}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[#0d0f14] p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Call-to-action details */}
                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <div>
                    <span className="text-[10px] text-[#8b93a7] block font-semibold uppercase">Total Charge</span>
                    <span className="text-lg font-black text-white">$9.99 <span className="text-[10px] text-[#8b93a7] font-normal">/mo</span></span>
                  </div>
                  <button
                    onClick={async () => {
                      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
                        alert("Please fill out all card details to unlock Premium.")
                        return
                      }
                      setIsProcessing(true)
                      
                      // Simulate card authorization delay
                      setTimeout(() => {
                        try {
                          const rawUser = localStorage.getItem('user')
                          if (rawUser) {
                            const parsed = JSON.parse(rawUser)
                            parsed.is_admin = true // Promote to Premium Admin instantly
                            localStorage.setItem('user', JSON.stringify(parsed))
                          }
                          setPaymentSuccess(true)
                        } catch (err) {
                          alert("Failed to update user profile claims.")
                        } finally {
                          setIsProcessing(false)
                        }
                      }, 1800)
                    }}
                    disabled={isProcessing}
                    className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 px-6 py-3 text-xs font-extrabold text-black transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Processing...' : 'Pay $9.99 🚀'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
