import { useState } from 'react'

interface Point {
  id: number
  x: number
  y: number
  label: 'red' | 'blue'
}

const POINTS: Point[] = [
  // Red circles (generally lower-left, upper-right)
  { id: 1, x: 1.5, y: 1.5, label: 'red' },
  { id: 2, x: 2.0, y: 1.0, label: 'red' },
  { id: 3, x: 1.0, y: 2.2, label: 'red' },
  { id: 4, x: 2.5, y: 2.8, label: 'red' },
  { id: 5, x: 4.8, y: 4.8, label: 'red' },
  { id: 6, x: 5.5, y: 4.2, label: 'red' },
  { id: 7, x: 4.2, y: 5.2, label: 'red' },
  { id: 8, x: 5.0, y: 3.5, label: 'red' },
  
  // Blue squares (generally lower-right, upper-left)
  { id: 9, x: 4.5, y: 1.5, label: 'blue' },
  { id: 10, x: 5.2, y: 1.0, label: 'blue' },
  { id: 11, x: 3.8, y: 1.8, label: 'blue' },
  { id: 12, x: 5.0, y: 2.5, label: 'blue' },
  { id: 13, x: 1.2, y: 4.8, label: 'blue' },
  { id: 14, x: 1.8, y: 5.5, label: 'blue' },
  { id: 15, x: 2.2, y: 4.5, label: 'blue' },
  { id: 16, x: 1.0, y: 3.8, label: 'blue' },
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

export function DecisionTreePlayground() {
  const [maxDepth, setMaxDepth] = useState<number>(1)

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
        <span className="text-sm text-[#8b93a7]">Decision Tree Boundary</span>
        <span className="rounded-lg bg-[var(--color-accent)]/15 px-2 py-0.5 text-xs font-bold text-[var(--color-accent-bright)]">
          Depth Limit: {maxDepth}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Left: 2D Feature Space Boundary splits */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-[#8b93a7] font-semibold mb-2">Feature Space Splits</span>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full max-w-[280px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] select-none"
            role="img"
            aria-label="Decision Tree Feature Space Grid"
          >
            {/* Split boundary regions */}
            {/* Depth 1: Split horizontally at Y = 3.2 */}
            {maxDepth >= 1 && (
              <>
                {/* Upper region background (Blue majority above Y=3.2) */}
                <rect x={PAD} y={PAD} width={W - 2 * PAD} height={(toCy(3.2) - PAD)} fill="rgba(96, 165, 250, 0.08)" />
                {/* Lower region background (Red majority below Y=3.2) */}
                <rect x={PAD} y={toCy(3.2)} width={W - 2 * PAD} height={H - PAD - toCy(3.2)} fill="rgba(248, 113, 113, 0.08)" />
                {/* Horizontal split line */}
                <line x1={PAD} y1={toCy(3.2)} x2={W - PAD} y2={toCy(3.2)} stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="3 3" />
              </>
            )}

            {/* Depth 2: Split vertically for lower region at X = 3.2, upper region at X = 2.8 */}
            {maxDepth >= 2 && (
              <>
                {/* Lower Left (Red majority) */}
                <rect x={PAD} y={toCy(3.2)} width={toCx(3.2) - PAD} height={H - PAD - toCy(3.2)} fill="rgba(248, 113, 113, 0.12)" />
                {/* Lower Right (Blue majority) */}
                <rect x={toCx(3.2)} y={toCy(3.2)} width={W - PAD - toCx(3.2)} height={H - PAD - toCy(3.2)} fill="rgba(96, 165, 250, 0.12)" />
                {/* Vertical split 1 */}
                <line x1={toCx(3.2)} y1={toCy(3.2)} x2={toCx(3.2)} y2={H - PAD} stroke="#f59e0b" strokeWidth={2} />

                {/* Upper Left (Blue majority) */}
                <rect x={PAD} y={PAD} width={toCx(2.8) - PAD} height={toCy(3.2) - PAD} fill="rgba(96, 165, 250, 0.12)" />
                {/* Upper Right (Red majority) */}
                <rect x={toCx(2.8)} y={PAD} width={W - PAD - toCx(2.8)} height={toCy(3.2) - PAD} fill="rgba(248, 113, 113, 0.12)" />
                {/* Vertical split 2 */}
                <line x1={toCx(2.8)} y1={PAD} x2={toCx(2.8)} y2={toCy(3.2)} stroke="#f59e0b" strokeWidth={2} />
              </>
            )}

            {/* Grid background ticks */}
            {Array.from({ length: X_MAX + 1 }, (_, i) => i).map((i) => (
              <g key={i}>
                <line x1={toCx(i)} y1={PAD} x2={toCx(i)} y2={H - PAD} stroke="#2a3144" strokeWidth={0.5} strokeDasharray="2 2" />
                <line x1={PAD} y1={toCy(i)} x2={W - PAD} y2={toCy(i)} stroke="#2a3144" strokeWidth={0.5} strokeDasharray="2 2" />
              </g>
            ))}

            {/* Data Points */}
            {POINTS.map((p) => (
              <g key={p.id}>
                {p.label === 'red' ? (
                  <circle cx={toCx(p.x)} cy={toCy(p.y)} r={5} fill="#f87171" stroke="white" strokeWidth={1} />
                ) : (
                  <rect x={toCx(p.x) - 4.5} y={toCy(p.y) - 4.5} width={9} height={9} fill="#60a5fa" stroke="white" strokeWidth={1} />
                )}
              </g>
            ))}

            {/* Legend/Axes */}
            <text x={W - PAD - 20} y={H - 8} fill="#8b93a7" fontSize={9}>X (Temp)</text>
            <text x={8} y={PAD - 8} fill="#8b93a7" fontSize={9}>Y (Humidity)</text>
          </svg>
        </div>

        {/* Right: Structural Tree Graph Node Layout */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-[#8b93a7] font-semibold mb-2">Resulting Tree Structure</span>
          <div className="w-full max-w-[280px] h-[280px] border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] p-3 overflow-y-auto flex flex-col items-center justify-start text-center font-mono">
            {/* Level 0 Root */}
            <div className="rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-border)] px-3 py-1.5 text-[10px] w-[140px] text-white">
              <span className="text-amber-400 font-bold block">Root Split</span>
              Is Humidity &gt; 3.2?
            </div>
            
            {/* Root-to-Child branches */}
            <div className="flex justify-between w-[200px] h-6 relative mt-1">
              <div className="w-0.5 h-full bg-[var(--color-border)] absolute left-1/4 transform -rotate-45" />
              <div className="w-0.5 h-full bg-[var(--color-border)] absolute right-1/4 transform rotate-45" />
            </div>

            {/* Level 1 Nodes */}
            <div className="flex justify-between w-full px-2 mt-1">
              {/* Left node (humidity > 3.2, mostly blue) */}
              <div className="w-[110px] flex flex-col items-center">
                {maxDepth >= 2 ? (
                  <div className="rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-border)] px-1.5 py-1 text-[9px] w-[100px] text-white">
                    <span className="text-amber-400 font-bold block">Split 2a</span>
                    Is Temp &gt; 2.8?
                  </div>
                ) : (
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[9px] w-[100px] text-blue-300">
                    <span className="font-bold block">Leaf: Predict Blue</span>
                    Purity: 7/8 Blue
                  </div>
                )}
              </div>

              {/* Right node (humidity <= 3.2, mostly red) */}
              <div className="w-[110px] flex flex-col items-center">
                {maxDepth >= 2 ? (
                  <div className="rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-border)] px-1.5 py-1 text-[9px] w-[100px] text-white">
                    <span className="text-amber-400 font-bold block">Split 2b</span>
                    Is Temp &gt; 3.2?
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[9px] w-[100px] text-red-300">
                    <span className="font-bold block">Leaf: Predict Red</span>
                    Purity: 7/8 Red
                  </div>
                )}
              </div>
            </div>

            {/* Level 2 Nodes (Only shown if maxDepth >= 2) */}
            {maxDepth >= 2 && (
              <>
                <div className="flex justify-between w-full px-1 h-6 relative mt-1">
                  <div className="flex justify-around w-1/2">
                    <div className="w-0.5 h-full bg-[var(--color-border)] transform -rotate-45" />
                    <div className="w-0.5 h-full bg-[var(--color-border)] transform rotate-45" />
                  </div>
                  <div className="flex justify-around w-1/2">
                    <div className="w-0.5 h-full bg-[var(--color-border)] transform -rotate-45" />
                    <div className="w-0.5 h-full bg-[var(--color-border)] transform rotate-45" />
                  </div>
                </div>

                <div className="flex justify-between w-full mt-1">
                  {/* Left-Left leaf */}
                  <div className="rounded-md border border-blue-500/40 bg-blue-500/20 px-1 py-0.5 text-[8px] w-[60px] text-blue-200">
                    <strong>Blue</strong>
                    <br />(4/4)
                  </div>
                  {/* Left-Right leaf */}
                  <div className="rounded-md border border-red-500/40 bg-red-500/20 px-1 py-0.5 text-[8px] w-[60px] text-red-200">
                    <strong>Red</strong>
                    <br />(3/4)
                  </div>
                  {/* Right-Left leaf */}
                  <div className="rounded-md border border-red-500/40 bg-red-500/20 px-1 py-0.5 text-[8px] w-[60px] text-red-200">
                    <strong>Red</strong>
                    <br />(4/4)
                  </div>
                  {/* Right-Right leaf */}
                  <div className="rounded-md border border-blue-500/40 bg-blue-500/20 px-1 py-0.5 text-[8px] w-[60px] text-blue-200">
                    <strong>Blue</strong>
                    <br />(3/4)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Depth Slider */}
      <div className="mt-6 space-y-4 border-t border-[var(--color-border)] pt-4">
        <div>
          <label className="flex justify-between text-sm">
            <span>Maximum Tree Depth (max_depth)</span>
            <span className="font-mono text-[var(--color-accent-bright)] font-bold">{maxDepth}</span>
          </label>
          <input
            type="range"
            min={1}
            max={2}
            step={1}
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <p className="text-xs text-[#8b93a7] leading-relaxed">
          💡 <strong>Observe Overfitting:</strong> A depth of 1 splits the data using a single horizontal cut. At depth 2, the algorithm adds vertical splits on both sides, classifying subgroups. If we increased depth further to 4+, the boundary boxes would isolate single outlier points (like the red circle at top-right corner or blue square at top-left), hurting generalization.
        </p>
      </div>
    </div>
  )
}
