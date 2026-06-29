import { useMemo, useState } from 'react'

const ARRAY_VALUES = [10, 20, 30, 40, 50, 60, 70, 80]

export function NumPySlicePlayground() {
  const [start, setStart] = useState<number>(1)
  const [stop, setStop] = useState<number>(7)
  const [step, setStep] = useState<number>(2)

  // Compute indices included in slice
  const slicedIndices = useMemo(() => {
    const indices: number[] = []
    const actualStop = stop === null ? ARRAY_VALUES.length : stop

    if (step > 0) {
      for (let i = start; i < actualStop && i < ARRAY_VALUES.length; i += step) {
        indices.push(i)
      }
    } else if (step < 0) {
      // In python step can be negative, but let's keep it simple (1 to 4) for our visual helper
      for (let i = start; i > actualStop && i >= 0; i += step) {
        indices.push(i)
      }
    }
    return indices
  }, [start, stop, step])

  const sliceResult = useMemo(() => {
    return slicedIndices.map((i) => ARRAY_VALUES[i])
  }, [slicedIndices])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      {/* Code statement box */}
      <div className="rounded-xl bg-[#0a0c10] p-4 text-center font-mono text-lg text-[var(--color-accent-bright)] border border-[var(--color-border)]">
        <span className="text-[#a8b0c4]">arr = np.array([10, 20, 30, 40, 50, 60, 70, 80])</span>
        <br />
        <span className="text-white font-bold">
          arr[{start}:{stop}:{step}]
        </span>{' '}
        <span className="text-[#8b93a7]"># = np.array({JSON.stringify(sliceResult)})</span>
      </div>

      {/* Visual Array Grid */}
      <div className="my-6">
        <div className="flex justify-center gap-1.5 overflow-x-auto pb-2">
          {ARRAY_VALUES.map((val, idx) => {
            const isSelected = slicedIndices.includes(idx)
            const isStart = idx === start
            const isStop = idx === stop

            return (
              <div key={idx} className="flex flex-col items-center select-none">
                {/* Index label */}
                <span className="text-xs text-[#8b93a7] font-mono mb-1">[{idx}]</span>
                {/* Array cell */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-base font-bold transition-all duration-300 ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/20 text-white scale-105 shadow-md shadow-[var(--color-accent)]/10'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[#8b93a7]'
                  }`}
                >
                  {val}
                </div>
                {/* Markers */}
                <div className="mt-1 h-4 text-[9px] font-semibold tracking-wider uppercase font-mono">
                  {isStart && <span className="text-[var(--color-success)]">Start</span>}
                  {!isStart && isStop && <span className="text-[var(--color-danger)]">Stop</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interactive controls */}
      <div className="mt-4 space-y-4 border-t border-[var(--color-border)] pt-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-success)] font-semibold">Start Index</span>
            <span className="font-mono">{start}</span>
          </div>
          <input
            type="range"
            min={0}
            max={ARRAY_VALUES.length}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-success)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-danger)] font-semibold">Stop Index (Exclusive)</span>
            <span className="font-mono">{stop}</span>
          </div>
          <input
            type="range"
            min={0}
            max={ARRAY_VALUES.length}
            value={stop}
            onChange={(e) => setStop(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-danger)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-accent-bright)] font-semibold">Step Size</span>
            <span className="font-mono">{step}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--color-accent)]"
          />
        </div>

        <p className="text-xs text-[#8b93a7] leading-relaxed">
          💡 <strong>How to play:</strong> NumPy slices use the syntax <code>[start:stop:step]</code>. The slice starts at index <code>start</code> (inclusive), ends at <code>stop</code> (exclusive), and takes every <code>step</code>-th element. Notice how setting the stop index to 4 means element at index 4 is never included!
        </p>
      </div>
    </div>
  )
}
