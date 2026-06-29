import { useCallback, useMemo, useState } from 'react'

const POINTS = [
  { x: 1, y: 2.2 },
  { x: 2, y: 2.8 },
  { x: 3, y: 3.5 },
  { x: 4, y: 4.1 },
  { x: 5, y: 4.8 },
  { x: 2.5, y: 3.0 },
  { x: 3.5, y: 3.8 },
  { x: 4.5, y: 4.5 },
]

const W = 500
const H = 320
const PAD = 40
const X_MAX = 6
const Y_MAX = 6

function toCx(x: number): number {
  return PAD + (x / X_MAX) * (W - 2 * PAD)
}

function toCy(y: number): number {
  return H - PAD - (y / Y_MAX) * (H - 2 * PAD)
}

function mse(slope: number, intercept: number): number {
  let sum = 0
  for (const p of POINTS) {
    const pred = slope * p.x + intercept
    sum += (p.y - pred) ** 2
  }
  return sum / POINTS.length
}

export function LinearRegressionDraw() {
  const [slope, setSlope] = useState(0.8)
  const [intercept, setIntercept] = useState(1.2)

  const error = useMemo(() => mse(slope, intercept), [slope, intercept])
  const goodFit = error < 0.15

  const lineX1 = 0
  const lineY1 = intercept
  const lineX2 = X_MAX
  const lineY2 = slope * X_MAX + intercept

  const handleDrag = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const cx = ((e.clientX - rect.left) / rect.width) * W
    const cy = ((e.clientY - rect.top) / rect.height) * H

    const x = ((cx - PAD) / (W - 2 * PAD)) * X_MAX
    const y = ((H - PAD - cy) / (H - 2 * PAD)) * Y_MAX

    if (x > 0.5 && x < X_MAX - 0.5) {
      const newSlope = (y - intercept) / x
      setSlope(Math.max(0.2, Math.min(1.5, newSlope)))
    }
  }, [intercept])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto w-full max-w-[500px] cursor-crosshair"
        onClick={handleDrag}
        role="img"
        aria-label="Linear regression drawing area"
      >
        {/* Grid */}
        {Array.from({ length: 7 }, (_, i) => i).map((i) => (
          <g key={i}>
            <line
              x1={toCx(i)}
              y1={PAD}
              x2={toCx(i)}
              y2={H - PAD}
              stroke="#2a3144"
              strokeWidth={1}
            />
            <line
              x1={PAD}
              y1={toCy(i)}
              x2={W - PAD}
              y2={toCy(i)}
              stroke="#2a3144"
              strokeWidth={1}
            />
          </g>
        ))}

        {/* Error lines */}
        {POINTS.map((p, i) => {
          const pred = slope * p.x + intercept
          return (
            <line
              key={i}
              x1={toCx(p.x)}
              y1={toCy(p.y)}
              x2={toCx(p.x)}
              y2={toCy(pred)}
              stroke="var(--color-danger)"
              strokeWidth={1}
              opacity={0.4}
            />
          )
        })}

        {/* Regression line */}
        <line
          x1={toCx(lineX1)}
          y1={toCy(lineY1)}
          x2={toCx(lineX2)}
          y2={toCy(lineY2)}
          stroke="var(--color-accent-bright)"
          strokeWidth={3}
        />

        {/* Data points */}
        {POINTS.map((p, i) => (
          <circle key={i} cx={toCx(p.x)} cy={toCy(p.y)} r={6} fill="var(--color-accent)" stroke="white" strokeWidth={1.5} />
        ))}

        <text x={PAD} y={20} fill="#8b93a7" fontSize={12}>Price</text>
        <text x={W - PAD - 30} y={H - 8} fill="#8b93a7" fontSize={12}>Size</text>
      </svg>

      <div className="mt-4 space-y-3">
        <div>
          <label className="flex justify-between text-sm">
            <span>Slope (m)</span>
            <span className="font-mono">{slope.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.2}
            max={1.5}
            step={0.01}
            value={slope}
            onChange={(e) => setSlope(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Intercept (b)</span>
            <span className="font-mono">{intercept.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.05}
            value={intercept}
            onChange={(e) => setIntercept(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface-overlay)] px-4 py-3">
          <span className="text-sm text-[#8b93a7]">Mean Squared Error</span>
          <span
            className={`font-mono text-lg font-semibold ${
              goodFit ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'
            }`}
          >
            {error.toFixed(3)}
          </span>
        </div>

        {goodFit && (
          <p className="rounded-lg bg-[var(--color-success)]/10 px-3 py-2 text-sm text-[var(--color-success)]">
            Great fit! Your line closely matches the data.
          </p>
        )}
        <p className="text-xs text-[#8b93a7]">Click on the chart or use sliders to adjust the line.</p>
      </div>
    </div>
  )
}
