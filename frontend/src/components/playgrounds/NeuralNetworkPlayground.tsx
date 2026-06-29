import { useState, useMemo } from 'react'

interface Point {
  id: number
  x: number
  y: number
  label: 'red' | 'blue'
}

const POINTS: Point[] = [
  // Class Red (Lower-left)
  { id: 1, x: 1.0, y: 1.5, label: 'red' },
  { id: 2, x: 1.5, y: 1.0, label: 'red' },
  { id: 3, x: 2.0, y: 2.0, label: 'red' },
  { id: 4, x: 2.8, y: 1.2, label: 'red' },
  { id: 5, x: 1.2, y: 2.8, label: 'red' },

  // Class Blue (Upper-right)
  { id: 6, x: 4.5, y: 4.0, label: 'blue' },
  { id: 7, x: 5.0, y: 4.8, label: 'blue' },
  { id: 8, x: 3.5, y: 5.0, label: 'blue' },
  { id: 9, x: 5.5, y: 3.5, label: 'blue' },
  { id: 10, x: 3.8, y: 3.8, label: 'blue' },
]

const W = 280
const H = 280
const PAD = 30
const X_MAX = 6
const Y_MAX = 6

function toCx(x: number): number {
  return PAD + (x / X_MAX) * (W - 2 * PAD)
}

function toCy(y: number): number {
  return H - PAD - (y / Y_MAX) * (H - 2 * PAD)
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

export function NeuralNetworkPlayground() {
  const [w1, setW1] = useState<number>(0.8)
  const [w2, setW2] = useState<number>(1.2)
  const [bias, setBias] = useState<number>(-5.0)

  // Decision boundary line points: w1*x + w2*y + b = 0 => y = (-w1*x - b)/w2
  const linePoints = useMemo(() => {
    if (w2 === 0) return null
    const x1 = 0
    const y1 = (-w1 * x1 - bias) / w2
    const x2 = X_MAX
    const y2 = (-w1 * x2 - bias) / w2

    return {
      cx1: toCx(x1),
      cy1: toCy(y1),
      cx2: toCx(x2),
      cy2: toCy(y2),
    }
  }, [w1, w2, bias])

  // Compute accuracy
  const metrics = useMemo(() => {
    let correct = 0
    POINTS.forEach((p) => {
      const z = w1 * p.x + w2 * p.y + bias
      const pred = sigmoid(z) >= 0.5 ? 'blue' : 'red'
      if (pred === p.label) correct++
    })
    return {
      accuracy: (correct / POINTS.length) * 100,
    }
  }, [w1, w2, bias])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
        <span className="text-sm text-[#8b93a7]">Perceptron Decision Boundary</span>
        <span className="rounded-lg bg-[var(--color-success)]/15 px-2.5 py-0.5 text-xs font-bold text-[var(--color-success)]">
          Accuracy: {metrics.accuracy.toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Left: Interactive Neuron Node Graph */}
        <div className="flex flex-col items-center border border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl p-4 min-h-[280px] justify-center relative font-mono select-none">
          <span className="text-[10px] text-[#8b93a7] font-semibold absolute top-2">Neuron Graph Layout</span>

          <div className="flex justify-between w-full items-center px-4 mt-4">
            
            {/* Input Nodes */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-overlay)] text-xs text-[#8b93a7] font-bold">
                  X₁
                </div>
                <span className="text-[9px] text-[#8b93a7] mt-1 font-bold">Temp</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-overlay)] text-xs text-[#8b93a7] font-bold">
                  X₂
                </div>
                <span className="text-[9px] text-[#8b93a7] mt-1 font-bold">Humidity</span>
              </div>
            </div>

            {/* Connecting Weights Line drawing */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* x1 to output */}
              <line x1={80} y1={90} x2={190} y2={140} stroke="var(--color-accent)" strokeWidth={Math.max(1, Math.abs(w1) * 2)} opacity={0.6} />
              {/* x2 to output */}
              <line x1={80} y1={190} x2={190} y2={140} stroke="var(--color-accent)" strokeWidth={Math.max(1, Math.abs(w2) * 2)} opacity={0.6} />
            </svg>

            {/* Output Neuron Node */}
            <div className="flex flex-col items-center z-10 mr-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-surface-overlay)] text-center text-white">
                <span className="text-[9px] text-[#8b93a7] uppercase font-bold">Activation</span>
                <span className="text-xs font-bold mt-0.5">Sigmoid</span>
              </div>
              <span className="text-[9px] text-[#8b93a7] mt-1 font-bold">Output (Y)</span>
            </div>

          </div>

          <div className="mt-4 text-[10px] text-center text-[#8b93a7] max-w-[200px] leading-relaxed">
            Formula: <span className="text-white">σ({w1.toFixed(1)}·X₁ + {w2.toFixed(1)}·X₂ + {bias.toFixed(1)})</span>
          </div>
        </div>

        {/* Right: 2D Feature space and separation line */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-[#8b93a7] font-semibold mb-2">Separating Hyperplane</span>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full max-w-[280px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] select-none"
            role="img"
            aria-label="Separating boundary graph"
          >
            {/* Coordinate grid tick marks */}
            {Array.from({ length: X_MAX + 1 }, (_, i) => i).map((i) => (
              <g key={i}>
                <line x1={toCx(i)} y1={PAD} x2={toCx(i)} y2={H - PAD} stroke="#2a3144" strokeWidth={0.5} strokeDasharray="2 2" />
                <line x1={PAD} y1={toCy(i)} x2={W - PAD} y2={toCy(i)} stroke="#2a3144" strokeWidth={0.5} strokeDasharray="2 2" />
              </g>
            ))}

            {/* Boundary hyperplane line */}
            {linePoints && (
              <line
                x1={linePoints.cx1}
                y1={linePoints.cy1}
                x2={linePoints.cx2}
                y2={linePoints.cy2}
                stroke="#fbbf24"
                strokeWidth={3}
                opacity={0.9}
              />
            )}

            {/* Classification colored shading regions */}
            {/* Display simple classification overlay representing the linear decision split */}

            {/* Data Points */}
            {POINTS.map((p) => {
              const score = w1 * p.x + w2 * p.y + bias
              const prediction = sigmoid(score) >= 0.5 ? 'blue' : 'red'
              const isCorrect = prediction === p.label

              return (
                <g key={p.id}>
                  {/* Accuracy highlight rings */}
                  {!isCorrect && (
                    <circle cx={toCx(p.x)} cy={toCy(p.y)} r={9} fill="none" stroke="var(--color-danger)" strokeWidth={1} />
                  )}
                  {p.label === 'red' ? (
                    <circle cx={toCx(p.x)} cy={toCy(p.y)} r={5} fill="#f87171" stroke="white" strokeWidth={1} />
                  ) : (
                    <rect x={toCx(p.x) - 4.5} y={toCy(p.y) - 4.5} width={9} height={9} fill="#60a5fa" stroke="white" strokeWidth={1} />
                  )}
                </g>
              )
            })}

            <text x={W - PAD - 20} y={H - 8} fill="#8b93a7" fontSize={9}>X₁</text>
            <text x={8} y={PAD - 8} fill="#8b93a7" fontSize={9}>X₂</text>
          </svg>
        </div>

      </div>

      {/* Weight & Bias Adjustments Sliders */}
      <div className="mt-6 space-y-4 border-t border-[var(--color-border)] pt-4">
        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span>Weight 1 (w₁)</span>
            <span className="font-mono text-[var(--color-accent-bright)]">{w1.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={w1}
            onChange={(e) => setW1(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span>Weight 2 (w₂)</span>
            <span className="font-mono text-[var(--color-accent-bright)]">{w2.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={w2}
            onChange={(e) => setW2(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span>Bias (b)</span>
            <span className="font-mono text-[var(--color-accent-bright)]">{bias.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-10}
            max={5}
            step={0.2}
            value={bias}
            onChange={(e) => setBias(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <p className="text-xs text-[#8b93a7] leading-relaxed">
          💡 <strong>Hyperplane Math:</strong> The yellow dividing line represents the equation <code>w₁·X₁ + w₂·X₂ + b = 0</code>.
          - Modifying **weights (w₁, w₂)** rotates the line (changes boundary sensitivity).
          - Modifying **bias (b)** shifts the line back and forth (sets classification threshold).
        </p>
      </div>
    </div>
  )
}
