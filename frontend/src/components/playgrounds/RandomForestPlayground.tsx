import { useState } from 'react'

interface Point {
  id: number
  x: number
  y: number
  label: 'red' | 'blue'
}

const POINTS: Point[] = [
  // Class Red
  { id: 1, x: 1.2, y: 1.5, label: 'red' },
  { id: 2, x: 1.5, y: 2.8, label: 'red' },
  { id: 3, x: 2.2, y: 1.2, label: 'red' },
  { id: 4, x: 2.8, y: 2.2, label: 'red' },
  { id: 5, x: 1.8, y: 3.8, label: 'red' }, // Outlier in blue region

  // Class Blue
  { id: 6, x: 4.8, y: 4.5, label: 'blue' },
  { id: 7, x: 5.2, y: 3.2, label: 'blue' },
  { id: 8, x: 3.8, y: 4.8, label: 'blue' },
  { id: 9, x: 5.0, y: 2.0, label: 'blue' },
  { id: 10, x: 3.2, y: 3.5, label: 'blue' }, // Outlier in red region
]

const W = 500
const H = 300
const PAD = 40
const X_MAX = 6
const Y_MAX = 6

function toCx(x: number): number {
  return PAD + (x / X_MAX) * (W - 2 * PAD)
}

function toCy(y: number): number {
  return H - PAD - (y / Y_MAX) * (H - 2 * PAD)
}

type Mode = 'tree1' | 'tree2' | 'tree3' | 'ensemble'

export function RandomForestPlayground() {
  const [mode, setMode] = useState<Mode>('ensemble')

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 select-none">
      <div className="flex flex-wrap gap-2 justify-between border-b border-[var(--color-border)] pb-3 mb-4 items-center">
        <span className="text-sm text-[#8b93a7]">Random Forest Boundary Shifting</span>
        <div className="flex flex-wrap gap-1">
          {(['tree1', 'tree2', 'tree3', 'ensemble'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase transition-colors ${
                mode === m
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] hover:text-white'
              }`}
            >
              {m === 'ensemble' ? 'Ensemble Vote' : m.replace('tree', 'Tree ')}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto w-full max-w-[500px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        role="img"
        aria-label="Random Forest Decision Boundary Space"
      >
        {/* Draw Boundary shaded regions based on selected mode */}
        
        {/* Tree 1: Splits vertically at X=3.5. Left is mostly Red, Right is Blue. */}
        {mode === 'tree1' && (
          <>
            {/* Red region */}
            <rect x={PAD} y={PAD} width={toCx(3.5) - PAD} height={H - 2 * PAD} fill="rgba(248, 113, 113, 0.12)" />
            {/* Blue region */}
            <rect x={toCx(3.5)} y={PAD} width={W - PAD - toCx(3.5)} height={H - 2 * PAD} fill="rgba(96, 165, 250, 0.12)" />
            {/* Split line */}
            <line x1={toCx(3.5)} y1={PAD} x2={toCx(3.5)} y2={H - PAD} stroke="#fbbf24" strokeWidth={2} />
          </>
        )}

        {/* Tree 2: Splits horizontally at Y=3.0. Lower is Red, Upper is Blue. */}
        {mode === 'tree2' && (
          <>
            {/* Blue region */}
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={toCy(3.0) - PAD} fill="rgba(96, 165, 250, 0.12)" />
            {/* Red region */}
            <rect x={PAD} y={toCy(3.0)} width={W - 2 * PAD} height={H - PAD - toCy(3.0)} fill="rgba(248, 113, 113, 0.12)" />
            {/* Split line */}
            <line x1={PAD} y1={toCy(3.0)} x2={W - PAD} y2={toCy(3.0)} stroke="#fbbf24" strokeWidth={2} />
          </>
        )}

        {/* Tree 3: Splits diagonally (represented by vertical split at X=3.0, and split at Y=2.5) */}
        {mode === 'tree3' && (
          <>
            {/* Left side below Y=4.0 is Red */}
            <rect x={PAD} y={toCy(4.0)} width={toCx(3.0) - PAD} height={H - PAD - toCy(4.0)} fill="rgba(248, 113, 113, 0.12)" />
            {/* Rest is Blue */}
            <rect x={toCx(3.0)} y={PAD} width={W - PAD - toCx(3.0)} height={H - 2 * PAD} fill="rgba(96, 165, 250, 0.12)" />
            <line x1={toCx(3.0)} y1={PAD} x2={toCx(3.0)} y2={H - PAD} stroke="#fbbf24" strokeWidth={2} />
            <line x1={PAD} y1={toCy(4.0)} x2={toCx(3.0)} y2={toCy(4.0)} stroke="#fbbf24" strokeWidth={2} />
          </>
        )}

        {/* Ensemble Vote: Blended boundary combining all split matrices */}
        {mode === 'ensemble' && (
          <>
            {/* Left Region (Strong Red vote) */}
            <rect x={PAD} y={toCy(3.0)} width={toCx(3.0) - PAD} height={H - PAD - toCy(3.0)} fill="rgba(248, 113, 113, 0.15)" />
            {/* Right Region (Strong Blue vote) */}
            <rect x={toCx(3.5)} y={PAD} width={W - PAD - toCx(3.5)} height={toCy(3.0) - PAD} fill="rgba(96, 165, 250, 0.15)" />
            
            {/* Blended Voting boundary representation */}
            <path
              d={`M ${toCx(3.0)} ${toCy(0)} L ${toCx(3.0)} ${toCy(3.0)} L ${toCx(3.5)} ${toCy(3.0)} L ${toCx(3.5)} ${toCy(6)}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={3}
              strokeDasharray="4 4"
            />
          </>
        )}

        {/* Grid lines */}
        {Array.from({ length: X_MAX + 1 }, (_, i) => i).map((i) => (
          <g key={i}>
            <line x1={toCx(i)} y1={PAD} x2={toCx(i)} y2={H - PAD} stroke="#2a3144" strokeWidth={0.5} strokeDasharray="2 2" />
            <line x1={PAD} y1={toCy(i)} x2={W - PAD} y2={toCy(i)} stroke="#2a3144" strokeWidth={0.5} strokeDasharray="2 2" />
          </g>
        ))}

        {/* Data points */}
        {POINTS.map((p) => (
          <g key={p.id}>
            {p.label === 'red' ? (
              <circle cx={toCx(p.x)} cy={toCy(p.y)} r={6} fill="#f87171" stroke="white" strokeWidth={1} />
            ) : (
              <rect x={toCx(p.x) - 5} y={toCy(p.y) - 5} width={10} height={10} fill="#60a5fa" stroke="white" strokeWidth={1} />
            )}
          </g>
        ))}

        <text x={W - PAD - 20} y={H - 12} fill="#8b93a7" fontSize={10}>Feature 1</text>
        <text x={10} y={PAD - 8} fill="#8b93a7" fontSize={10}>Feature 2</text>
      </svg>

      <p className="text-[11px] text-[#8b93a7] leading-relaxed mt-4">
        💡 <strong>Ensemble Strength:</strong> Notice how individual trees make sharp, jagged cuts. Tree 1 misclassifies the outlier at (1.8, 3.8). By taking the **Ensemble Vote** of all three trees, the final Random Forest boundary averages out, ignoring noisy outliers to generalize much better!
      </p>
    </div>
  )
}
