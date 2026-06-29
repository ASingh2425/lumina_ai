import React, { useState, useMemo, useCallback, useRef } from 'react'

interface DataPoint {
  id: number
  x: number
  y: number
  label: 'orange' | 'teal'
}

const INITIAL_POINTS: DataPoint[] = [
  // Class Orange (Generally Left/Top)
  { id: 1, x: 1.5, y: 4.5, label: 'orange' },
  { id: 2, x: 1.2, y: 3.2, label: 'orange' },
  { id: 3, x: 2.2, y: 3.8, label: 'orange' },
  { id: 4, x: 1.8, y: 2.5, label: 'orange' },
  { id: 5, x: 2.8, y: 4.2, label: 'orange' },
  { id: 6, x: 2.5, y: 2.0, label: 'orange' },
  { id: 7, x: 3.2, y: 3.5, label: 'orange' },
  // Class Teal (Generally Right/Bottom)
  { id: 8, x: 4.5, y: 1.8, label: 'teal' },
  { id: 9, x: 5.2, y: 2.2, label: 'teal' },
  { id: 10, x: 4.0, y: 1.2, label: 'teal' },
  { id: 11, x: 5.0, y: 1.0, label: 'teal' },
  { id: 12, x: 3.8, y: 2.2, label: 'teal' },
  { id: 13, x: 4.8, y: 3.0, label: 'teal' },
  { id: 14, x: 5.5, y: 2.8, label: 'teal' },
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

interface KnnPlaygroundProps {
  sandbox?: boolean
}

export function KnnPlayground({ sandbox = false }: KnnPlaygroundProps) {
  const [points, setPoints] = useState<DataPoint[]>(INITIAL_POINTS)
  const [queryPt, setQueryPt] = useState({ x: 3.5, y: 2.5 })
  const [k, setK] = useState(3)
  const [newLabel, setNewLabel] = useState<'orange' | 'teal'>('orange')
  const [draggingQuery, setDraggingQuery] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Find distance to all points and sort to get nearest neighbors
  const neighbors = useMemo(() => {
    const calculated = points.map((p) => {
      const dist = getDistance(p, queryPt)
      return { ...p, dist }
    })
    // Sort ascending
    return calculated.sort((a, b) => a.dist - b.dist)
  }, [points, queryPt])

  // Get top K nearest neighbors
  const kNearest = useMemo(() => {
    return neighbors.slice(0, k)
  }, [neighbors, k])

  // Majority voting logic
  const votes = useMemo(() => {
    let orangeCount = 0
    let tealCount = 0
    kNearest.forEach((n) => {
      if (n.label === 'orange') orangeCount++
      else tealCount++
    })
    return {
      orange: orangeCount,
      teal: tealCount,
      winner: orangeCount >= tealCount ? 'orange' : 'teal',
    }
  }, [kNearest])

  // Handle drag of query point
  const handleMouseDownQuery = () => {
    setDraggingQuery(true)
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!draggingQuery || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const cx = ((e.clientX - rect.left) / rect.width) * W
      const cy = ((e.clientY - rect.top) / rect.height) * H

      const x = Math.max(0.1, Math.min(X_MAX - 0.1, fromCx(cx)))
      const y = Math.max(0.1, Math.min(Y_MAX - 0.1, fromCy(cy)))

      setQueryPt({ x, y })
    },
    [draggingQuery]
  )

  const handleMouseUp = () => {
    setDraggingQuery(false)
  }

  // Handle clicking on grid to add points (sandbox mode)
  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingQuery || !sandbox || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const cx = ((e.clientX - rect.left) / rect.width) * W
    const cy = ((e.clientY - rect.top) / rect.height) * H

    // If click is very close to query point, don't add point (avoid overlap immediately)
    const x = fromCx(cx)
    const y = fromCy(cy)
    if (getDistance({ x, y }, queryPt) < 0.25) return

    // Add point
    const newPt: DataPoint = {
      id: Date.now(),
      x: Math.max(0.1, Math.min(X_MAX - 0.1, x)),
      y: Math.max(0.1, Math.min(Y_MAX - 0.1, y)),
      label: newLabel,
    }
    setPoints((prev) => [...prev, newPt])
  }

  // Reset sandbox points
  const handleResetPoints = () => {
    setPoints(INITIAL_POINTS)
    setQueryPt({ x: 3.5, y: 2.5 })
    setK(3)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-sm text-[#8b93a7]">KNN Classification</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8b93a7]">Winner:</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
              votes.winner === 'orange'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-teal-500/20 text-teal-400'
            }`}
          >
            {votes.winner} ({votes.winner === 'orange' ? votes.orange : votes.teal} / {k} votes)
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto mt-4 w-full max-w-[500px] select-none"
        onClick={handleGridClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="img"
        aria-label="K-Nearest Neighbors Grid"
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

        {/* Lines connecting query point to K nearest neighbors */}
        {kNearest.map((n) => (
          <line
            key={`link-${n.id}`}
            x1={toCx(queryPt.x)}
            y1={toCy(queryPt.y)}
            x2={toCx(n.x)}
            y2={toCy(n.y)}
            stroke={n.label === 'orange' ? '#f59e0b' : '#14b8a6'}
            strokeWidth={2}
            strokeDasharray="3 3"
            opacity={0.8}
          />
        ))}

        {/* Training Data Points */}
        {points.map((p) => {
          const isKNearest = kNearest.some((n) => n.id === p.id)
          return (
            <g key={`group-${p.id}`}>
              {/* Highlight ring for K nearest neighbors */}
              {isKNearest && (
                <circle
                  cx={toCx(p.x)}
                  cy={toCy(p.y)}
                  r={12}
                  fill="none"
                  stroke={p.label === 'orange' ? '#f59e0b' : '#14b8a6'}
                  strokeWidth={1.5}
                  opacity={0.6}
                  className="animate-ping"
                />
              )}
              {p.label === 'orange' ? (
                <circle
                  cx={toCx(p.x)}
                  cy={toCy(p.y)}
                  r={6}
                  fill="#f59e0b"
                  stroke="white"
                  strokeWidth={1}
                />
              ) : (
                <rect
                  x={toCx(p.x) - 5}
                  y={toCy(p.y) - 5}
                  width={10}
                  height={10}
                  fill="#14b8a6"
                  stroke="white"
                  strokeWidth={1}
                />
              )}
            </g>
          )
        })}

        {/* Query Point (White Star/Target, draggable) */}
        <g
          transform={`translate(${toCx(queryPt.x)},${toCy(queryPt.y)})`}
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDownQuery}
        >
          <circle r={14} fill="white" opacity={0.15} />
          <circle r={8} fill="none" stroke="white" strokeWidth={1.5} />
          <path
            d="M 0,-12 L 0,12 M -12,0 L 12,0"
            stroke="white"
            strokeWidth={1.5}
          />
          <circle r={3} fill="#ec4899" />
        </g>

        {/* Labels */}
        <text x={W - PAD - 20} y={H - 12} fill="#8b93a7" fontSize={11}>Fruit Size</text>
        <text x={10} y={PAD - 10} fill="#8b93a7" fontSize={11}>Fruit Weight</text>
      </svg>

      <div className="mt-4 space-y-4">
        {/* K Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span>Parameter K (Number of Neighbors)</span>
            <span className="font-mono font-semibold text-[var(--color-accent-bright)]">K = {k}</span>
          </div>
          <input
            type="range"
            min={1}
            max={9}
            step={2}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <p className="text-xs text-[#8b93a7]">
          💡 <strong>How to play:</strong> Drag the pink-centered white target. Watch the dashed lines snap to the {k} closest data points. The target is classified as whatever class has the majority vote.
        </p>

        {/* Sandbox controls */}
        {sandbox && (
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8b93a7]">Click on grid to add:</span>
                <button
                  type="button"
                  onClick={() => setNewLabel('orange')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    newLabel === 'orange'
                      ? 'bg-amber-500 text-white'
                      : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] hover:text-white'
                  }`}
                >
                  ● Orange
                </button>
                <button
                  type="button"
                  onClick={() => setNewLabel('teal')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    newLabel === 'teal'
                      ? 'bg-teal-500 text-white'
                      : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] hover:text-white'
                  }`}
                >
                  ■ Teal
                </button>
              </div>
              <button
                type="button"
                onClick={handleResetPoints}
                className="rounded-xl border border-[var(--color-border)] px-4 py-1.5 text-xs font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)]"
              >
                Reset Points
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
