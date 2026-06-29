import React, { useState, useEffect } from 'react'
import type { InteractiveCodeLab as LabType } from '../../types/lesson'

interface InteractiveCodeLabProps {
  lab: LabType
  onCorrect?: () => void
}

export function InteractiveCodeLab({ lab, onCorrect }: InteractiveCodeLabProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '> Python interpreter initialized.',
    '> Ready. Fill in the blanks and hit Run Code.'
  ])
  const [isSuccess, setIsSuccess] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  // Reset states when lab changes
  useEffect(() => {
    setInputs({})
    setConsoleLogs([
      '> Python interpreter initialized.',
      '> Ready. Fill in the blanks and hit Run Code.'
    ])
    setIsSuccess(false)
    setShowSolution(false)
  }, [lab])

  const handleInputChange = (key: string, val: string) => {
    setInputs((prev) => ({ ...prev, [key]: val }))
  }

  // Parse template and split it to render inputs inline
  const renderTemplate = () => {
    let parts: (string | React.ReactNode)[] = [lab.template]

    lab.blanks.forEach((blank) => {
      const placeholderToken = `{${blank.key}}`
      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part === 'string' && part.includes(placeholderToken)) {
          const splitText = part.split(placeholderToken)
          
          splitText.forEach((text, idx) => {
            newParts.push(text)
            if (idx < splitText.length - 1) {
              const currentVal = inputs[blank.key] || ''
              const widthStyle = Math.max(4, Math.max(currentVal.length, blank.placeholder.length)) * 8.5

              newParts.push(
                <input
                  key={blank.key}
                  type="text"
                  value={currentVal}
                  placeholder={blank.placeholder}
                  onChange={(e) => handleInputChange(blank.key, e.target.value)}
                  style={{ width: `${widthStyle}px` }}
                  className="mx-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] px-1.5 py-0.5 text-xs font-mono text-[var(--color-success)] outline-none focus:border-[var(--color-accent)] placeholder:text-[#4e5870] font-bold text-center"
                />
              )
            }
          })
        } else {
          newParts.push(part)
        }
      })
      parts = newParts
    })

    return <pre className="font-mono text-xs leading-relaxed text-[#a8d4a8] whitespace-pre-wrap">{parts}</pre>
  }

  // Verify code answers
  const handleVerify = () => {
    let allCorrect = true
    const errors: string[] = []

    lab.blanks.forEach((blank) => {
      const userVal = (inputs[blank.key] || '').trim()
      const correctVal = blank.correct.trim()

      if (userVal !== correctVal) {
        allCorrect = false
        errors.push(`NameError: expected correct implementation for variable blank [${blank.placeholder}]. Got "${userVal || 'empty'}"`)
      }
    })

    if (allCorrect) {
      setConsoleLogs([
        `> Running script.py...`,
        ...lab.expectedOutput.split('\n').map((line) => `  ${line}`),
        `> Script executed successfully.`,
        `> SUCCESS: Code matches target criteria! +25 XP`
      ])
      setIsSuccess(true)
      onCorrect?.()
    } else {
      setConsoleLogs([
        `> Running script.py...`,
        ...errors.map((err) => `❌ ${err}`),
        `> Traceback (most recent call last):`,
        `  File "script.py", line 6, in <module>`,
        `ValueError: Incorrect logic parameters. Please check your inputs.`
      ])
      setIsSuccess(false)
    }
  }

  // Populate answers
  const handleShowAnswer = () => {
    const answers: Record<string, string> = {}
    lab.blanks.forEach((b) => {
      answers[b.key] = b.correct
    })
    setInputs(answers)
    setShowSolution(true)
    setConsoleLogs([
      '> Hint: Answers populated. Click Run Code to execute.'
    ])
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] overflow-hidden">
      {/* Top IDE toolbar header */}
      <div className="flex justify-between items-center bg-[#0d1117] border-b border-[var(--color-border)] px-4 py-2 text-xs text-[#8b93a7]">
        <div className="flex items-center gap-2 font-mono">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="ml-2">script.py</span>
        </div>
        <button
          type="button"
          onClick={handleShowAnswer}
          className="text-xs hover:text-white transition-colors"
        >
          {showSolution ? 'Answer Shown' : 'Need help? Reveal Answer'}
        </button>
      </div>

      {/* Inline editable code block panel */}
      <div className="bg-[#0a0c10] p-5 border-b border-[var(--color-border)] overflow-x-auto select-none">
        {renderTemplate()}
      </div>

      {/* integrated retro terminal console */}
      <div className="bg-[#040608] p-4 font-mono text-[11px] leading-relaxed text-[#c4cad8] min-h-[100px] max-h-[140px] overflow-y-auto">
        <span className="text-[#8b93a7] block border-b border-[var(--color-border)]/20 pb-1 mb-2 font-semibold uppercase tracking-wider text-[9px]">
          Output Console
        </span>
        {consoleLogs.map((log, idx) => (
          <div key={idx} className={log.startsWith('❌') ? 'text-[var(--color-danger)]' : log.includes('SUCCESS') ? 'text-[var(--color-success)] font-bold' : ''}>
            {log}
          </div>
        ))}
      </div>

      {/* Executable action footer */}
      <div className="bg-[var(--color-surface-overlay)] px-4 py-3 flex justify-between items-center">
        <span className="text-[10px] text-[#8b93a7]">Complete the blanks in the python code template to test.</span>
        <button
          type="button"
          onClick={handleVerify}
          className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
            isSuccess
              ? 'bg-[var(--color-success)] text-white shadow-md shadow-[var(--color-success)]/10'
              : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-bright)]'
          }`}
        >
          {isSuccess ? 'Verified ✓' : 'Run Code ▷'}
        </button>
      </div>
    </div>
  )
}
