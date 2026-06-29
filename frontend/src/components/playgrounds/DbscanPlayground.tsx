import { useState, useMemo, useRef } from 'react'

interface Point {
  id: number
  x: number
  y: number
}

const POINTS: Point[] = [
  // Cluster 1 (Dense center-left)
  { id: 1, x: 2.0, y: 2.2 },
  { id: 2, x: 2.2, y: 2.0 },
  { id: 3, x: 1.8, y: 2.5 },
  { id: 4, x: 2.4, y: 2.6 },
  { id: 5, x: 2.1, y: 2.8 },
  { id: 6, x: 1.6, y: 1.8 },
  
  // Cluster 2 (Dense top-right)
  { id: 7, x: 4.5, y: 4.5 },
  { id: 8, x: 4.8, y: 4.2 },
  { id: 9, x: 4.2, y: 4.8 },
  { id: 10, x: 5.0, y: 5.0 },
  { id: 11, x: 4.0, y: 4.2 },
  { id: 12, x: 5.2, y: 4.4 },

  // Outliers / Noise
  { id: 13, x: 1.0, y: 4.8 },
  { id: 14, x: 5.5, y: 1.5 },
  { id: 15, x: 3.2, y: 3.2 },
  { id: 16, x: 1.2, y: 1.0 },
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

function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export function DbscanPlayground() {
  const [eps, setEps] = useState<number>(0.8)
  const [minPts, setMinPts] = useState<number>(4)
  const [selectedPtId, setSelectedPtId] = useState<number | null>(3)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Compute neighborhood mapping
  const neighborhoods = useMemo(() => {
    const map: Record<number, number[]> = {}
    POINTS.forEach((p1) => {
      const neighbors: number[] = []
      POINTS.forEach((p2) => {
        if (getDistance(p1, p2) <= eps) {
          neighbors.push(p2.id)
        }
      })
      map[p1.id] = neighbors
    })
    return map
  }, [eps])

  // Identify core points
  const corePoints = useMemo(() => {
    const cores = new Set<number>()
    POINTS.forEach((p) => {
      if (neighborhoods[p.id].length >= minPts) {
        cores.add(p.id)
      }
    })
    return cores
  }, [neighborhoods, minPts])

  // Identify border vs noise points
  const classifications = useMemo(() => {
    const map: Record<number, 'core' | 'border' | 'noise'> = {}
    POINTS.forEach((p) => {
      if (corePoints.has(p.id)) {
        map[p.id] = 'core'
      } else {
        // Check if within epsilon of any core point
        const neighbors = neighborhoods[p.id]
        const isBorder = neighbors.some((nId) => corePoints.has(nId))
        if (isBorder) {
          map[p.id] = 'border'
        } else {
          map[p.id] = 'noise'
        }
      }
    })
    return map
  }, [corePoints, neighborhoods])

  const selectedPt = useMemo(() => {
    return POINTS.find((p) => p.id === selectedPtId) || null
  }, [selectedPtId])

  const selectedNeighbors = useMemo(() => {
    if (selectedPtId === null) return []
    return neighborhoods[selectedPtId] || []
  }, [selectedPtId, neighborhoods])

  // Calculate epsilon in SVG pixels
  const epsPx = useMemo(() => {
    // Difference between x=0 and x=eps
    return toCx(eps) - toCx(0)
  }, [eps])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
        <span className="text-sm text-[#8b93a7]">DBSCAN Point Classification</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded-full">
            ● Core ({POINTS.filter((p) => classifications[p.id] === 'core').length})
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-warning)] bg-[var(--color-warning)]/10 px-2 py-0.5 rounded-full">
            ● Border ({POINTS.filter((p) => classifications[p.id] === 'border').length})
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-danger)] bg-[var(--color-danger)]/10 px-2 py-0.5 rounded-full">
            ● Noise ({POINTS.filter((p) => classifications[p.id] === 'noise').length})
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto w-full max-w-[500px] select-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        role="img"
        aria-label="DBSCAN Grid Visualizer"
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
            strokeWidth={0.5}
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
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />
        ))}

        {/* Selected point epsilon radius overlay */}
        {selectedPt && (
          <circle
            cx={toCx(selectedPt.x)}
            cy={toCy(selectedPt.y)}
            r={epsPx}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={0.6}
          />
        )}

        {/* Data points */}
        {POINTS.map((p) => {
          const type = classifications[p.id]
          const isSelected = selectedPtId === p.id
          const inSelectedNeighborhood = selectedNeighbors.includes(p.id)

          let fillColor = '#8b93a7' // grey
          if (type === 'core') fillColor = 'var(--color-success)'
          else if (type === 'border') fillColor = 'var(--color-warning)'
          else if (type === 'noise') fillColor = 'var(--color-danger)'

          return (
            <g
              key={p.id}
              onClick={() => setSelectedPtId(p.id)}
              className="cursor-pointer"
            >
              {/* Highlight selection glow */}
              {isSelected && (
                <circle cx={toCx(p.x)} cy={toCy(p.y)} r={13} fill="none" stroke="white" strokeWidth={1} />
              )}
              {/* Neighborhood ring */}
              {inSelectedNeighborhood && !isSelected && (
                <circle cx={toCx(p.x)} cy={toCy(p.y)} r={10} fill="none" stroke="var(--color-accent-bright)" strokeWidth={1} strokeDasharray="2 2" />
              )}
              <circle
                cx={toCx(p.x)}
                cy={toCy(p.y)}
                r={6}
                fill={fillColor}
                stroke={isSelected ? 'white' : '#141820'}
                strokeWidth={1.5}
              />
            </g>
          )
        })}

        {/* Coordinates labels */}
        <text x={W - PAD - 25} y={H - 12} fill="#8b93a7" fontSize={10}>Feature X</text>
        <text x={10} y={PAD - 8} fill="#8b93a7" fontSize={10}>Feature Y</text>
      </svg>

      {/* Selected point information panel */}
      {selectedPt && (
        <div className="mt-4 rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border)] p-3 text-xs leading-relaxed text-[#c4cad8]">
          <span className="text-white font-bold block mb-1">Selected Point Info</span>
          Classified as: <span className="font-semibold text-white uppercase">{classifications[selectedPt.id]}</span> · Neighbors inside radius ε: <span className="text-white font-bold">{selectedNeighbors.length}</span> (needs {minPts} to become a Core point).
        </div>
      )}

      {/* Sliders */}
      <div className="mt-4 space-y-4 border-t border-[var(--color-border)] pt-4">
        <div>
          <div className="flex justify-between text-sm">
            <span>Neighborhood Radius (Epsilon - ε)</span>
            <span className="font-mono text-[var(--color-accent-bright)] font-bold">{eps.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.4}
            max={1.6}
            step={0.05}
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span>Minimum Points (MinPts)</span>
            <span className="font-mono text-[var(--color-accent-bright)] font-bold">{minPts}</span>
          </div>
          <input
            type="range"
            min={2}
            max={6}
            step={1}
            value={minPts}
            onChange={(e) => setMinPts(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <p className="text-xs text-[#8b93a7] leading-relaxed">
          💡 <strong>Density Rules:</strong> DBSCAN classifies point density based on <code>eps</code> (size of circle) and <code>MinPts</code> (how many points fall inside the circle). Increase epsilon or reduce MinPts to see noise points merge into core/border clusters!
        </p>
      </div>
    </div>
  )
}
