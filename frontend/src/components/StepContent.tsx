import { useState } from 'react'
import type { LessonStep, WidgetType } from '../types/lesson'
import { GradientDescentPlayground } from './playgrounds/GradientDescentPlayground'
import { LinearRegressionDraw } from './playgrounds/LinearRegressionDraw'
import { KMeansPlayground } from './playgrounds/KMeansPlayground'
import { KnnPlayground } from './playgrounds/KnnPlayground'
import { NumPySlicePlayground } from './playgrounds/NumPySlicePlayground'
import { DecisionTreePlayground } from './playgrounds/DecisionTreePlayground'
import { DbscanPlayground } from './playgrounds/DbscanPlayground'
import { NeuralNetworkPlayground } from './playgrounds/NeuralNetworkPlayground'
import { SelfAttentionPlayground } from './playgrounds/SelfAttentionPlayground'
import { RagPlayground } from './playgrounds/RagPlayground'
import { TokenizerPlayground } from './playgrounds/TokenizerPlayground'
import { MathStepContent, MarkdownContent } from './stepHelpers'

import { CnnPlayground } from './playgrounds/CnnPlayground'
import { PcaPlayground } from './playgrounds/PcaPlayground'
import { RandomForestPlayground } from './playgrounds/RandomForestPlayground'
import { InterviewPlayground } from './playgrounds/InterviewPlayground'
import { ProjectPushPlayground } from './playgrounds/ProjectPushPlayground'
import { NetflixSimulator } from './playgrounds/NetflixSimulator'
import { PythonCodeConsole } from './playgrounds/PythonCodeConsole'

import { LossLandscape3DPlayground } from './playgrounds/LossLandscape3DPlayground'
import { AutogradPlayground } from './playgrounds/AutogradPlayground'
import { TransformerAttentionPlayground } from './playgrounds/TransformerAttentionPlayground'

function Widget({ type, step, sandbox }: { type: WidgetType; step: LessonStep; sandbox?: boolean }) {
  const topic = step.id.startsWith('gd-')
    ? 'gradient-descent'
    : step.id.startsWith('rag-')
    ? 'rag-pipeline'
    : 'tokenizer'

  if (type === 'gradient-descent') return <GradientDescentPlayground sandbox={sandbox} />
  if (type === 'linear-regression') return <LinearRegressionDraw />
  if (type === 'k-means') return <KMeansPlayground sandbox={sandbox} />
  if (type === 'knn') return <KnnPlayground sandbox={sandbox} />
  if (type === 'numpy-slice') return <NumPySlicePlayground />
  if (type === 'decision-tree') return <DecisionTreePlayground />
  if (type === 'dbscan') return <DbscanPlayground />
  if (type === 'neural-network') return <NeuralNetworkPlayground />
  if (type === 'self-attention') return <SelfAttentionPlayground />
  if (type === 'rag-pipeline') return <RagPlayground />
  if (type === 'tokenizer') return <TokenizerPlayground />
  if (type === 'cnn') return <CnnPlayground />
  if (type === 'pca') return <PcaPlayground />
  if (type === 'random-forest') return <RandomForestPlayground />
  if (type === 'interview-recruiter') return <InterviewPlayground topic={topic} />
  if (type === 'project-push') return <ProjectPushPlayground topic={topic} />
  if (type === 'netflix-simulator') return <NetflixSimulator />
  
  if (type === 'loss-landscape-3d') return <LossLandscape3DPlayground />
  if (type === 'autograd') return <AutogradPlayground />
  if (type === 'transformer-attention') return <TransformerAttentionPlayground />
  
  return null
}

import { InteractiveCodeLab } from './playgrounds/InteractiveCodeLab'

interface StepContentProps {
  step: LessonStep
  onQuizCorrect?: () => void
}

function EmbeddedQuizBlock({ step, onQuizCorrect }: { step: LessonStep, onQuizCorrect?: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  
  if (!step.embeddedQuiz) return null
  const { prompt, options, correctId, explanation } = step.embeddedQuiz
  const answered = selected !== null
  const isCorrect = selected === correctId

  return (
    <div className="mt-8 border-t border-[var(--color-border)] pt-6">
      <h3 className="text-xs font-bold text-[var(--color-accent)] mb-4 tracking-wider">CONCEPT CHECK</h3>
      <p className="mb-4 text-base font-medium text-white">{prompt}</p>
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          const isOptCorrect = opt.id === correctId
          let border = 'border-[var(--color-border)]'
          if (answered && isSelected && isOptCorrect) border = 'border-[var(--color-success)] bg-[var(--color-success)]/10'
          if (answered && isSelected && !isOptCorrect) border = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10'
          if (answered && !isSelected && isOptCorrect) border = 'border-[var(--color-success)]/50'
          
          return (
             <button
                key={opt.id}
                type="button"
                disabled={answered}
                onClick={() => {
                  setSelected(opt.id)
                  if (opt.id === correctId) onQuizCorrect?.()
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--color-surface-overlay)] disabled:cursor-default ${border}`}
              >
                {opt.label}
              </button>
          )
        })}
      </div>
      {answered && (
         <div className="mt-4">
            {isCorrect ? (
               <p className="rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] px-4 py-3 text-sm">
                  {explanation}
               </p>
            ) : (
               <div className="rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 p-4">
                  <p className="text-[var(--color-danger)] text-sm font-bold mb-2">Not quite.</p>
                  <p className="text-sm text-white leading-relaxed">{step.adaptiveFeedback || explanation}</p>
               </div>
            )}
         </div>
      )}
    </div>
  )
}

function RealWorldContextBlock({ context }: { context?: string }) {
   if (!context) return null
   return (
      <div className="mt-6 mb-6 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
         <h4 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2">
            <span className="text-base">🌍</span> REAL WORLD USAGE
         </h4>
         <p className="text-sm text-blue-100/80 leading-relaxed">{context}</p>
      </div>
   )
}

export function StepContent({ step, onQuizCorrect }: StepContentProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  // Pure Quiz Step
  if (step.type === 'quiz' && step.quiz) {
    const { prompt, options, correctId, explanation } = step.quiz
    const answered = selected !== null
    const isCorrect = selected === correctId

    return (
      <div>
        <p className="mb-6 text-lg font-medium text-white">{prompt}</p>
        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = selected === opt.id
            const isOptCorrect = opt.id === correctId
            let border = 'border-[var(--color-border)]'
            if (answered && isSelected && isOptCorrect)
              border = 'border-[var(--color-success)] bg-[var(--color-success)]/10'
            if (answered && isSelected && !isOptCorrect)
              border = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10'
            if (answered && !isSelected && isOptCorrect) border = 'border-[var(--color-success)]/50'

            return (
              <button
                key={opt.id}
                type="button"
                disabled={answered}
                onClick={() => {
                  setSelected(opt.id)
                  setShowExplanation(true)
                  if (opt.id === correctId) onQuizCorrect?.()
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--color-surface-overlay)] disabled:cursor-default ${border}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        {showExplanation && (
          <div className="mt-4">
            {isCorrect ? (
              <p className="rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] px-4 py-3 text-sm">
                {explanation}
              </p>
            ) : (
              <div className="rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 p-4">
                <p className="text-[var(--color-danger)] text-sm font-bold mb-2">Not quite.</p>
                <p className="text-sm text-white leading-relaxed">{step.adaptiveFeedback || explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {step.content && step.type !== 'math' && step.type !== 'code' && <MarkdownContent text={step.content} />}
      
      {step.type === 'math' && step.mathParts && (
        <MathStepContent content={step.content} mathParts={step.mathParts} formula={step.formula} />
      )}

      {step.type === 'code' && step.code && (
        <div>
          {step.content && <div className="mb-4"><MarkdownContent text={step.content} /></div>}
          {step.interactiveCode ? (
            <InteractiveCodeLab lab={step.interactiveCode} onCorrect={onQuizCorrect} />
          ) : (
            <PythonCodeConsole initialCode={step.code} />
          )}
        </div>
      )}

      {step.widget && step.widget !== 'none' && (
        <div className="mt-6">
          <Widget type={step.widget} step={step} sandbox={step.type === 'sandbox'} />
        </div>
      )}

      <RealWorldContextBlock context={step.realWorldContext} />
      <EmbeddedQuizBlock step={step} onQuizCorrect={onQuizCorrect} />
    </div>
  )
}
