import { useState, useMemo } from 'react'

interface Point3D {
  id: number
  x: number
  y: number
}

// Elongated diagonal cluster of points
const POINTS: Point3D[] = [
  { id: 1, x: -1.8, y: -1.5 },
  { id: 2, x: -1.2, y: -0.8 },
  { id: 3, x: -0.5, y: -0.6 },
  { id: 4, x: -0.2, y: -0.1 },
  { id: 5, x: 0.1, y: 0.2 },
  { id: 6, x: 0.4, y: 0.5 },
  { id: 7, x: 1.0, y: 0.8 },
  { id: 8, x: 1.5, y: 1.4 },
  { id: 9, x: 1.8, y: 1.6 },
  { id: 10, x: -0.8, y: -1.2 },
  { id: 11, x: 0.8, y: 1.2 },
]

const W = 500
const H = 300
const CENTER_X = W / 2
const CENTER_Y = H / 2
const SCALE = 60

export function PcaPlayground() {
  const [angleDeg, setAngleDeg] = useState<number>(45) // Angle of projection axis

  const angleRad = useMemo(() => (angleDeg * Math.PI) / 180, [angleDeg])

  // Direction vector of the projection line
  const axisVector = useMemo(() => {
    return {
      x: Math.cos(angleRad),
      y: Math.sin(angleRad),
    }
  }, [angleRad])

  // Projects points orthogonally onto the vector axis
  const projectedData = useMemo(() => {
    return POINTS.map((p) => {
      // Dot product: projection distance along axis
      const projDistance = p.x * axisVector.x + p.y * axisVector.y
      
      // Coordinate of projected point in 2D space
      const projX = projDistance * axisVector.x
      const projY = projDistance * axisVector.y

      return {
        ...p,
        projDistance,
        projX,
        projY,
      }
    })
  }, [axisVector])

  // Variance of the projected points: Mean of squared distances from center (since mean is approximately 0)
  const varianceValue = useMemo(() => {
    const sumSq = projectedData.reduce((sum, p) => sum + p.projDistance ** 2, 0)
    return sumSq / POINTS.length
  }, [projectedData])

  const maxReached = varianceValue > 1.8

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 select-none">
      <div className="flex flex-wrap gap-2 justify-between border-b border-[var(--color-border)] pb-3 mb-4 items-center">
        <span className="text-sm text-[#8b93a7]">PCA Dimensional Projection</span>
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface-overlay)] px-3 py-1 text-xs">
          <span className="text-[#8b93a7]">Preserved Variance:</span>
          <span
            className={`font-mono font-semibold ${
              maxReached ? 'text-[var(--color-success)]' : 'text-amber-400'
            }`}
          >
            {varianceValue.toFixed(3)}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto w-full max-w-[500px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        role="img"
        aria-label="PCA Projection Grid"
      >
        {/* Draw main axes */}
        <line x1={0} y1={CENTER_Y} x2={W} y2={CENTER_Y} stroke="#2a3144" strokeWidth={1} />
        <line x1={CENTER_X} y1={0} x2={CENTER_X} y2={H} stroke="#2a3144" strokeWidth={1} />

        {/* Projection axis line */}
        <line
          x1={CENTER_X - axisVector.x * 240}
          y1={CENTER_Y - axisVector.y * 240}
          x2={CENTER_X + axisVector.x * 240}
          y2={CENTER_Y + axisVector.y * 240}
          stroke="#fbbf24"
          strokeWidth={2.5}
        />

        {/* Projection links connecting points to line */}
        {projectedData.map((p) => (
          <line
            key={`link-${p.id}`}
            x1={CENTER_X + p.x * SCALE}
            y1={CENTER_Y - p.y * SCALE}
            x2={CENTER_X + p.projX * SCALE}
            y2={CENTER_Y - p.projY * SCALE}
            stroke="var(--color-accent-bright)"
            strokeWidth={1}
            strokeDasharray="2 2"
            opacity={0.5}
          />
        ))}

        {/* Projected points on the line */}
        {projectedData.map((p) => (
          <circle
            key={`proj-${p.id}`}
            cx={CENTER_X + p.projX * SCALE}
            cy={CENTER_Y - p.projY * SCALE}
            r={4}
            fill="#fbbf24"
            opacity={0.8}
          />
        ))}

        {/* Original Data points */}
        {projectedData.map((p) => (
          <circle
            key={`pt-${p.id}`}
            cx={CENTER_X + p.x * SCALE}
            cy={CENTER_Y - p.y * SCALE}
            r={6}
            fill="var(--color-accent)"
            stroke="white"
            strokeWidth={1.5}
          />
        ))}

        <text x={W - 100} y={CENTER_Y + 14} fill="#8b93a7" fontSize={10}>Original Dim X</text>
        <text x={CENTER_X + 8} y={20} fill="#8b93a7" fontSize={10}>Original Dim Y</text>
      </svg>

      {/* Axis Rotation Slider */}
      <div className="mt-4 space-y-4 border-t border-[var(--color-border)] pt-4">
        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span>Projection Line Angle</span>
            <span className="font-mono text-[var(--color-accent-bright)] font-bold">{angleDeg}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        {maxReached && (
          <p className="rounded-lg bg-[var(--color-success)]/10 px-3 py-2 text-xs text-[var(--color-success)]">
            🎯 <strong>Principal Component Found!</strong> At angle ≈ 45°, the line matches the diagonal direction of the points, preserving maximum variance. This is the first Principal Component (PC1).
          </p>
        )}

        <p className="text-[11px] text-[#8b93a7] leading-relaxed">
          💡 <strong>Dimension Reduction:</strong> PCA projects high-dimensional data onto a line (1D). By rotating the axis, try to spread the yellow projected points as much as possible. Maximizing this spread (variance) retains the most information!
        </p>
      </div>
    </div>
  )
}
