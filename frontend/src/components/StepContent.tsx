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
  return null
}

import { InteractiveCodeLab } from './playgrounds/InteractiveCodeLab'

interface StepContentProps {
  step: LessonStep
  onQuizCorrect?: () => void
}

export function StepContent({ step, onQuizCorrect }: StepContentProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  if (step.type === 'quiz' && step.quiz) {
    const { prompt, options, correctId, explanation } = step.quiz
    const answered = selected !== null

    return (
      <div>
        <p className="mb-6 text-lg font-medium text-white">{prompt}</p>
        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = selected === opt.id
            const isCorrect = opt.id === correctId
            let border = 'border-[var(--color-border)]'
            if (answered && isSelected && isCorrect)
              border = 'border-[var(--color-success)] bg-[var(--color-success)]/10'
            if (answered && isSelected && !isCorrect)
              border = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10'
            if (answered && !isSelected && isCorrect) border = 'border-[var(--color-success)]/50'

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
          <p className="mt-4 rounded-xl bg-[var(--color-surface-overlay)] px-4 py-3 text-sm leading-relaxed text-[#c4cad8]">
            {explanation}
          </p>
        )}
      </div>
    )
  }

  if (step.type === 'math' && step.mathParts) {
    return <MathStepContent content={step.content} mathParts={step.mathParts} formula={step.formula} />
  }

  if (step.type === 'code' && step.code) {
    return (
      <div>
        {step.content && <div className="mb-4"><MarkdownContent text={step.content} /></div>}
        {step.interactiveCode ? (
          <InteractiveCodeLab lab={step.interactiveCode} onCorrect={onQuizCorrect} />
        ) : (
          <pre className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[#0a0c10] p-5 font-mono text-sm leading-relaxed text-[#a8d4a8]">
            {step.code}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div>
      {step.content && <MarkdownContent text={step.content} />}
      {step.widget && step.widget !== 'none' && (
        <div className="mt-6">
          <Widget type={step.widget} step={step} sandbox={step.type === 'sandbox'} />
        </div>
      )}
    </div>
  )
}
