import { useState, useEffect, useRef } from 'react'

const IMAGE_GRID = [
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
]

// Sobel vertical edge detector kernel
const KERNEL = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
]

const CELL_SIZE = 36
const GRID_PAD = 10

export function CnnPlayground() {
  const [row, setRow] = useState<number>(0)
  const [col, setCol] = useState<number>(0)
  const [outputGrid, setOutputGrid] = useState<number[][]>(
    Array.from({ length: 4 }, () => Array(4).fill(0))
  )
  const [scanning, setScanning] = useState<boolean>(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Compute convolution value for the active position
  const activeCalc = useMemo(() => {
    let sum = 0
    const details: string[] = []
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const pixel = IMAGE_GRID[row + r][col + c]
        const kVal = KERNEL[r][c]
        sum += pixel * kVal
        if (kVal !== 0) {
          details.push(`(${pixel} * ${kVal})`)
        }
      }
    }
    return {
      value: sum,
      formula: details.join(' + ') + ` = ${sum}`,
    }
  }, [row, col])

  // Single step convolution sweep
  const stepScan = useCallback(() => {
    setOutputGrid((prev) => {
      const next = prev.map((rLine) => [...rLine])
      next[row][col] = activeCalc.value
      return next
    })

    setCol((c) => {
      if (c < 3) {
        return c + 1
      } else {
        setCol(0)
        setRow((r) => {
          if (r < 3) {
            return r + 1
          } else {
            // Finished scan, reset row
            setScanning(false)
            if (intervalRef.current) clearInterval(intervalRef.current)
            return 0
          }
        })
        return 0
      }
    })
  }, [row, col, activeCalc.value])

  const startAutoScan = () => {
    if (scanning) {
      setScanning(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setScanning(true)
    intervalRef.current = setInterval(() => {
      stepScan()
    }, 600)
  }

  const resetScan = () => {
    setScanning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRow(0)
    setCol(0)
    setOutputGrid(Array.from({ length: 4 }, () => Array(4).fill(0)))
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 select-none">
      <div className="flex flex-wrap gap-2 justify-between border-b border-[var(--color-border)] pb-3 mb-4 items-center">
        <span className="text-sm text-[#8b93a7]">CNN Scanning Step Visualizer</span>
        <span className="rounded-lg bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-accent-bright)]">
          Scanning Kernel at [{row}, {col}]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Input Image Grid with Kernel Overlay box */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#8b93a7] font-semibold mb-2 uppercase">Input Image (6x6)</span>
          <svg
            viewBox={`0 0 ${6 * CELL_SIZE + 2 * GRID_PAD} ${6 * CELL_SIZE + 2 * GRID_PAD}`}
            className="w-full max-w-[180px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            {IMAGE_GRID.map((line, rIdx) =>
              line.map((pixel, cIdx) => (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={GRID_PAD + cIdx * CELL_SIZE}
                  y={GRID_PAD + rIdx * CELL_SIZE}
                  width={CELL_SIZE - 2}
                  height={CELL_SIZE - 2}
                  fill={pixel === 1 ? '#e2e8f0' : '#141820'}
                  rx={4}
                />
              ))
            )}

            {/* Active sliding filter kernel box */}
            <rect
              x={GRID_PAD + col * CELL_SIZE - 2}
              y={GRID_PAD + row * CELL_SIZE - 2}
              width={3 * CELL_SIZE + 2}
              height={3 * CELL_SIZE + 2}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={3}
              rx={6}
              className="transition-all duration-300"
            />
          </svg>
        </div>

        {/* Middle: 3x3 Sobel Kernel display */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] text-[#8b93a7] font-semibold mb-2 uppercase">Sobel Filter Kernel</span>
          <div className="grid grid-cols-3 gap-1 p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] w-[110px] font-mono text-xs">
            {KERNEL.flat().map((kVal, idx) => (
              <div
                key={idx}
                className="h-7 w-7 rounded bg-[var(--color-surface-overlay)] border border-[var(--color-border)] flex items-center justify-center font-bold text-white"
              >
                {kVal}
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-[#8b93a7] leading-relaxed max-w-[130px] font-mono">
            Calculation:
            <span className="block text-white mt-1 font-bold">{activeCalc.formula}</span>
          </div>
        </div>

        {/* Right: 4x4 Output Feature Map grid */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#8b93a7] font-semibold mb-2 uppercase">Feature Map (4x4)</span>
          <svg
            viewBox={`0 0 ${4 * CELL_SIZE + 2 * GRID_PAD} ${4 * CELL_SIZE + 2 * GRID_PAD}`}
            className="w-full max-w-[140px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            {outputGrid.map((line, rIdx) =>
              line.map((val, cIdx) => {
                const isActive = row === rIdx && col === cIdx
                
                // Color scaling based on value
                let fill = '#141820'
                if (val !== 0) fill = val > 0 ? 'rgba(96, 165, 250, 0.4)' : 'rgba(248, 113, 113, 0.4)'

                return (
                  <g key={`${rIdx}-${cIdx}`}>
                    <rect
                      x={GRID_PAD + cIdx * CELL_SIZE}
                      y={GRID_PAD + rIdx * CELL_SIZE}
                      width={CELL_SIZE - 2}
                      height={CELL_SIZE - 2}
                      fill={fill}
                      stroke={isActive ? '#fbbf24' : 'none'}
                      strokeWidth={isActive ? 2 : 0}
                      rx={4}
                    />
                    <text
                      x={GRID_PAD + cIdx * CELL_SIZE + CELL_SIZE / 2}
                      y={GRID_PAD + rIdx * CELL_SIZE + CELL_SIZE / 2 + 4}
                      fill="white"
                      fontSize={11}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                  </g>
                )
              })
            )}
          </svg>
        </div>

      </div>

      {/* Buttons controls */}
      <div className="mt-4 border-t border-[var(--color-border)] pt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startAutoScan}
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-accent-bright)]"
        >
          {scanning ? 'Pause Scan' : 'Run Auto Scan'}
        </button>
        <button
          type="button"
          onClick={stepScan}
          disabled={scanning}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)] disabled:opacity-50"
        >
          Step Sweep
        </button>
        <button
          type="button"
          onClick={resetScan}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[#a8b0c4] hover:bg-[var(--color-surface-overlay)]"
        >
          Reset Grid
        </button>
      </div>

      <p className="text-[11px] text-[#8b93a7] leading-relaxed mt-4">
        💡 <strong>Edge Detection:</strong> This Sobel filter weighs pixels on the right as positive (<code>+1, +2, +1</code>) and left as negative (<code>-1, -2, -1</code>). It outputs high scores at boundaries where colors change suddenly, highlighting vertical edges in white!
      </p>
    </div>
  )
}
import { useCallback, useMemo } from 'react'
