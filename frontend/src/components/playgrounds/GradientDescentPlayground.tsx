import { useCallback, useEffect, useRef, useState } from 'react'

// Loss: f(x) = (x - 3)^2, minimum at x = 3
function loss(x: number): number {
  return (x - 3) ** 2
}

function gradient(x: number): number {
  return 2 * (x - 3)
}

const CANVAS_W = 560
const CANVAS_H = 280
const X_MIN = -1
const X_MAX = 7
const Y_MAX = 25

function toCanvasX(x: number): number {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * CANVAS_W
}

function toCanvasY(y: number): number {
  return CANVAS_H - (y / Y_MAX) * (CANVAS_H - 20) - 10
}

interface GradientDescentPlaygroundProps {
  sandbox?: boolean
}

export function GradientDescentPlayground({ sandbox = false }: GradientDescentPlaygroundProps) {
  const [learningRate, setLearningRate] = useState(0.1)
  const [startX, setStartX] = useState(0.5)
  const [theta, setTheta] = useState(0.5)
  const [history, setHistory] = useState<number[]>([0.5])
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [maxSteps, setMaxSteps] = useState(30)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = useCallback(() => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTheta(startX)
    setHistory([startX])
    setStep(0)
  }, [startX])

  useEffect(() => {
    reset()
  }, [startX, reset])

  const stepOnce = useCallback(() => {
    setTheta((prev) => {
      const next = prev - learningRate * gradient(prev)
      setHistory((h) => [...h, next])
      setStep((s) => s + 1)
      return next
    })
  }, [learningRate])

  const run = () => {
    if (running) {
      setRunning(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= maxSteps) {
          setRunning(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return s
        }
        setTheta((prev) => {
          const next = prev - learningRate * gradient(prev)
          setHistory((h) => [...h, next])
          return next
        })
        return s + 1
      })
    }, 400)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const diverging = Math.abs(theta) > 10 || loss(theta) > Y_MAX
  const converged = loss(theta) < 0.05

  // Curve points
  const curvePoints: string[] = []
  for (let x = X_MIN; x <= X_MAX; x += 0.05) {
    const y = Math.min(loss(x), Y_MAX)
    curvePoints.push(`${toCanvasX(x)},${toCanvasY(y)}`)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <svg
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className="mx-auto w-full max-w-[560px]"
        role="img"
        aria-label="Gradient descent visualization"
      >
        {/* Grid */}
        {[0, 5, 10, 15, 20].map((y) => (
          <line
            key={y}
            x1={0}
            y1={toCanvasY(y)}
            x2={CANVAS_W}
            y2={toCanvasY(y)}
            stroke="#2a3144"
            strokeWidth={1}
          />
        ))}

        {/* Loss curve */}
        <polyline
          points={curvePoints.join(' ')}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
        />

        {/* Path history */}
        {history.length > 1 && (
          <polyline
            points={history
              .map((x) => `${toCanvasX(x)},${toCanvasY(Math.min(loss(x), Y_MAX))}`)
              .join(' ')}
            fill="none"
            stroke="var(--color-warning)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={0.7}
          />
        )}

        {/* Ball */}
        <circle
          cx={toCanvasX(theta)}
          cy={toCanvasY(Math.min(loss(theta), Y_MAX))}
          r={10}
          fill={diverging ? 'var(--color-danger)' : converged ? 'var(--color-success)' : 'var(--color-accent-bright)'}
          stroke="white"
          strokeWidth={2}
        />

        {/* Minimum marker */}
        <circle cx={toCanvasX(3)} cy={toCanvasY(0)} r={4} fill="var(--color-success)" opacity={0.6} />
        <text x={toCanvasX(3) + 8} y={toCanvasY(0) + 4} fill="#8b93a7" fontSize={11}>
          min
        </text>

        {/* Axis labels */}
        <text x={CANVAS_W / 2} y={CANVAS_H - 2} fill="#8b93a7" fontSize={11} textAnchor="middle">
          θ (parameter)
        </text>
        <text x={8} y={14} fill="#8b93a7" fontSize={11}>
          Loss
        </text>
      </svg>

      <div className="mt-4 space-y-4">
        <div>
          <label className="flex justify-between text-sm">
            <span>Learning rate (η)</span>
            <span className="font-mono text-[var(--color-accent-bright)]">{learningRate}</span>
          </label>
          <input
            type="range"
            min={0.01}
            max={5}
            step={0.01}
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm">
            <span>Starting position</span>
            <span className="font-mono text-[var(--color-accent-bright)]">{startX.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={-0.5}
            max={6}
            step={0.1}
            value={startX}
            onChange={(e) => setStartX(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        {sandbox && (
          <div>
            <label className="flex justify-between text-sm">
              <span>Max steps</span>
              <span className="font-mono">{maxSteps}</span>
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={maxSteps}
              onChange={(e) => setMaxSteps(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--color-accent)]"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={run}
            className="rounded-xl bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white"
          >
            {running ? 'Pause' : 'Run'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={stepOnce}
            disabled={running}
            className="rounded-xl border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)] disabled:opacity-50"
          >
            Step
          </button>
          <span className="text-sm text-[#8b93a7]">
            Step {step} · Loss {loss(theta).toFixed(3)}
          </span>
        </div>

        {diverging && (
          <p className="rounded-lg bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]">
            Diverging! Learning rate is too high — the ball overshoots the minimum.
          </p>
        )}
        {converged && !diverging && (
          <p className="rounded-lg bg-[var(--color-success)]/10 px-3 py-2 text-sm text-[var(--color-success)]">
            Converged! The ball found the minimum at θ ≈ 3.
          </p>
        )}
      </div>
    </div>
  )
}
