import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'

interface Point {
  id: number
  x: number
  y: number
}

interface Centroid {
  id: number
  x: number
  y: number
  color: string
  name: string
}

const INITIAL_POINTS: Point[] = [
  // Cluster A (Top-Left)
  { id: 1, x: 1.2, y: 4.5 },
  { id: 2, x: 1.5, y: 4.0 },
  { id: 3, x: 1.8, y: 4.8 },
  { id: 4, x: 2.2, y: 4.2 },
  { id: 5, x: 1.0, y: 3.8 },
  { id: 6, x: 1.4, y: 3.5 },
  { id: 7, x: 2.0, y: 3.6 },
  // Cluster B (Bottom-Right)
  { id: 8, x: 4.5, y: 1.5 },
  { id: 9, x: 4.8, y: 1.0 },
  { id: 10, x: 5.2, y: 2.0 },
  { id: 11, x: 4.0, y: 1.2 },
  { id: 12, x: 5.0, y: 1.6 },
  { id: 13, x: 3.8, y: 1.8 },
  { id: 14, x: 4.2, y: 2.2 },
  // Cluster C (Top-Right)
  { id: 15, x: 4.5, y: 4.8 },
  { id: 16, x: 4.8, y: 4.2 },
  { id: 17, x: 5.0, y: 5.0 },
  { id: 18, x: 4.0, y: 4.5 },
  { id: 19, x: 5.3, y: 4.6 },
  { id: 20, x: 3.8, y: 3.9 },
  { id: 21, x: 4.3, y: 3.8 },
]

const INITIAL_CENTROIDS: Centroid[] = [
  { id: 0, x: 1.5, y: 1.5, color: '#f87171', name: 'Red' },    // Red Centroid
  { id: 1, x: 3.0, y: 4.5, color: '#34d399', name: 'Green' },  // Green Centroid
  { id: 2, x: 5.5, y: 3.0, color: '#60a5fa', name: 'Blue' },   // Blue Centroid
]

const W = 500
const H = 340
const PAD = 40
const X_MAX = 7
const Y_MAX = 6

function toCx(x: number): number {
  return PAD + (x / X_MAX) * (W - 2 * PAD)
}

function toCy(y: number): number {
  return H - PAD - (y / Y_MAX) * (H - 2 * PAD)
}

function fromCx(cx: number): number {
  return ((cx - PAD) / (W - 2 * PAD)) * X_MAX
}

function fromCy(cy: number): number {
  return ((H - PAD - cy) / (H - 2 * PAD)) * Y_MAX
}

function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

interface KMeansPlaygroundProps {
  sandbox?: boolean
}

export function KMeansPlayground({ sandbox = false }: KMeansPlaygroundProps) {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS)
  const [centroids, setCentroids] = useState<Centroid[]>(INITIAL_CENTROIDS)
  const [dragId, setDragId] = useState<number | null>(null)
  const [stepPhase, setStepPhase] = useState<'assign' | 'update'>('assign')
  const [iteration, setIteration] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Assign points to nearest centroid
  const assignments = useMemo(() => {
    return points.map((p) => {
      let minDist = Infinity
      let closestId = 0
      centroids.forEach((c) => {
        const d = getDistance(p, c)
        if (d < minDist) {
          minDist = d
          closestId = c.id
        }
      })
      return closestId
    })
  }, [points, centroids])

  // Total within-cluster sum of squares (Inertia)
  const inertia = useMemo(() => {
    let sum = 0
    points.forEach((p, idx) => {
      const centroid = centroids[assignments[idx]]
      sum += getDistance(p, centroid) ** 2
    })
    return sum
  }, [points, centroids, assignments])

  // Reset Centroids
  const handleReset = () => {
    setCentroids([
      { id: 0, x: 1.0, y: 1.5, color: '#f87171', name: 'Red' },
      { id: 1, x: 2.5, y: 4.8, color: '#34d399', name: 'Green' },
      { id: 2, x: 5.5, y: 1.5, color: '#60a5fa', name: 'Blue' },
    ])
    setIteration(0)
    setStepPhase('assign')
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  // Randomize Points
  const handleRandomizePoints = () => {
    const newPoints: Point[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: 0.8 + Math.random() * 5.4,
      y: 0.6 + Math.random() * 4.8,
    }))
    setPoints(newPoints)
    setIteration(0)
    setStepPhase('assign')
  }

  // Drag handlers for centroids
  const handleMouseDown = (centroidId: number) => {
    setDragId(centroidId)
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (dragId === null || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const cx = ((e.clientX - rect.left) / rect.width) * W
      const cy = ((e.clientY - rect.top) / rect.height) * H

      const x = Math.max(0.1, Math.min(X_MAX - 0.1, fromCx(cx)))
      const y = Math.max(0.1, Math.min(Y_MAX - 0.1, fromCy(cy)))

      setCentroids((prev) =>
        prev.map((c) => (c.id === dragId ? { ...c, x, y } : c))
      )
    },
    [dragId]
  )

  const handleMouseUp = () => {
    setDragId(null)
  }

  // Single step K-Means iteration
  const stepAlgorithm = useCallback(() => {
    if (stepPhase === 'assign') {
      // In assignment phase, we just highlight that clusters are assigned (already computed via useMemo)
      setStepPhase('update')
    } else {
      // In update phase, we shift centroids to the average of their assigned points
      setCentroids((prevCentroids) => {
        return prevCentroids.map((c) => {
          const assignedPoints = points.filter((_, idx) => assignments[idx] === c.id)
          if (assignedPoints.length === 0) return c // no points assigned, keep centroid where it is
          const avgX = assignedPoints.reduce((sum, p) => sum + p.x, 0) / assignedPoints.length
          const avgY = assignedPoints.reduce((sum, p) => sum + p.y, 0) / assignedPoints.length
          return { ...c, x: avgX, y: avgY }
        })
      })
      setIteration((i) => i + 1)
      setStepPhase('assign')
    }
  }, [stepPhase, points, assignments])

  // Run automatically
  const runAuto = () => {
    if (running) {
      setRunning(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setRunning(true)
    intervalRef.current = setInterval(() => {
      stepAlgorithm()
    }, 600)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-sm text-[#8b93a7]">
          {sandbox ? `Iteration ${iteration} · Phase: ${stepPhase === 'assign' ? 'Assign Points' : 'Update Centroids'}` : 'Interactive Clustering'}
        </span>
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface-overlay)] px-3 py-1 text-xs">
          <span className="text-[#8b93a7]">Inertia (Error):</span>
          <span className="font-mono font-semibold text-[var(--color-warning)]">
            {inertia.toFixed(2)}
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto mt-4 w-full max-w-[500px] select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="img"
        aria-label="K-Means interactive clustering grid"
      >
        {/* Grid lines */}
        {Array.from({ length: X_MAX + 1 }, (_, i) => i).map((i) => (
          <line
            key={`x-${i}`}
            x1={toCx(i)}
            y1={PAD}
            x2={toCx(i)}
            y2={H - PAD}
            stroke="#2a3144"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        ))}
        {Array.from({ length: Y_MAX + 1 }, (_, i) => i).map((i) => (
          <line
            key={`y-${i}`}
            x1={PAD}
            y1={toCy(i)}
            x2={W - PAD}
            y2={toCy(i)}
            stroke="#2a3144"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        ))}

        {/* Lines connecting points to centroids */}
        {points.map((p, idx) => {
          const centroid = centroids[assignments[idx]]
          return (
            <line
              key={`line-${p.id}`}
              x1={toCx(p.x)}
              y1={toCy(p.y)}
              x2={toCx(centroid.x)}
              y2={toCy(centroid.y)}
              stroke={centroid.color}
              strokeWidth={1}
              opacity={0.15}
            />
          )
        })}

        {/* Scattered Data Points */}
        {points.map((p, idx) => {
          const centroid = centroids[assignments[idx]]
          return (
            <circle
              key={`pt-${p.id}`}
              cx={toCx(p.x)}
              cy={toCy(p.y)}
              r={6}
              fill={centroid.color}
              stroke="white"
              strokeWidth={1}
              className="transition-colors duration-300"
            />
          )
        })}

        {/* Centroids (Larger, Draggable shapes) */}
        {centroids.map((c) => (
          <g
            key={`c-${c.id}`}
            transform={`translate(${toCx(c.x)},${toCy(c.y)})`}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={() => handleMouseDown(c.id)}
          >
            {/* Pulsing selection ring */}
            <circle r={18} fill="none" stroke={c.color} strokeWidth={1.5} opacity={0.4} className="animate-pulse" />
            {/* Centroid base */}
            <path
              d="M0,-12 L10,6 L-10,6 Z" // Triangle
              fill={c.color}
              stroke="white"
              strokeWidth={2}
            />
            {/* Label inside */}
            <text y={15} fill="white" fontSize={10} textAnchor="middle" fontWeight="bold">
              {c.name[0]}
            </text>
          </g>
        ))}

        {/* Axes titles */}
        <text x={W - PAD - 20} y={H - 12} fill="#8b93a7" fontSize={11}>Feature 1</text>
        <text x={10} y={PAD - 10} fill="#8b93a7" fontSize={11}>Feature 2</text>
      </svg>

      <div className="mt-4 space-y-3">
        <p className="text-xs text-[#8b93a7]">
          💡 <strong>How to play:</strong> Drag the triangular centroids around. The points will automatically snap to the nearest centroid. Try to place them so the error (Inertia) becomes as low as possible.
        </p>

        {sandbox && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={runAuto}
              className="rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-bright)]"
            >
              {running ? 'Pause' : 'Run Auto Loop'}
            </button>
            <button
              type="button"
              onClick={stepAlgorithm}
              disabled={running}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)] disabled:opacity-50"
            >
              {stepPhase === 'assign' ? '1. Assign Points' : '2. Update Centroids'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleRandomizePoints}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)]"
            >
              Randomize Points
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
