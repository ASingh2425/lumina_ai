import { useState, useMemo } from 'react'

export function TransformerAttentionPlayground() {
  const [text, setText] = useState('The cat sat on the mat')
  
  const tokens = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text])
  
  // Generate a stable pseudorandom attention matrix based on token strings
  const attentionMatrix = useMemo(() => {
    const matrix: number[][] = []
    const n = tokens.length
    for (let i = 0; i < n; i++) {
      const row: number[] = []
      let sum = 0
      for (let j = 0; j < n; j++) {
        // Mock Q*K^T logic: higher if same word, plus some random noise
        const sameWord = tokens[i].toLowerCase() === tokens[j].toLowerCase()
        const distance = Math.abs(i - j)
        let weight = sameWord ? 10 : 0
        weight += 5 / (distance + 1) // Attend locally
        // stable pseudo-random
        const pseudoRand = (tokens[i].charCodeAt(0) + tokens[j].charCodeAt(0)) % 5
        weight += pseudoRand
        
        // Exponentiate (mock softmax)
        const expW = Math.exp(weight / 3) 
        row.push(expW)
        sum += expW
      }
      // Normalize row
      matrix.push(row.map(val => val / sum))
    }
    return matrix
  }, [tokens])

  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Visual Transformer Attention Map</h3>
        <p className="text-sm text-[#94a3b8]">
          Type a sentence to see how a Transformer's Self-Attention mechanism assigns "importance" between words.
          (Mock weights computed via local proximity and token similarity).
        </p>
      </div>

      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg bg-[var(--color-surface-overlay)] px-4 py-3 text-white border border-[var(--color-border)] focus:border-blue-500 focus:outline-none"
          placeholder="Type a sentence here..."
        />
      </div>

      {tokens.length > 0 && tokens.length <= 15 ? (
        <div className="overflow-x-auto mt-4 pb-4">
          <div className="min-w-max">
            <div className="flex mb-2">
              <div className="w-24"></div>
              {tokens.map((token, j) => (
                <div key={j} className="w-16 text-center text-xs font-mono text-[#94a3b8] transform -rotate-45 origin-bottom-left truncate px-1">
                  {token}
                </div>
              ))}
            </div>
            
            {tokens.map((rowToken, i) => (
              <div key={i} className="flex items-center mb-1">
                <div className="w-24 text-right pr-4 text-xs font-mono text-white truncate">
                  {rowToken}
                </div>
                {tokens.map((colToken, j) => {
                  const weight = attentionMatrix[i][j]
                  const isHovered = hoveredCell?.row === i && hoveredCell?.col === j
                  const isRowColHovered = hoveredCell?.row === i || hoveredCell?.col === j
                  
                  return (
                    <div
                      key={j}
                      onMouseEnter={() => setHoveredCell({row: i, col: j})}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-16 h-10 border flex items-center justify-center text-[10px] cursor-pointer transition-colors duration-200
                        ${isHovered ? 'border-white z-10 scale-110 shadow-lg' : isRowColHovered ? 'border-blue-400/50' : 'border-transparent'}
                      `}
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${weight})`,
                        color: weight > 0.5 ? '#fff' : 'rgba(255,255,255,0.4)'
                      }}
                      title={`${rowToken} → ${colToken}: ${(weight * 100).toFixed(1)}%`}
                    >
                      {weight > 0.05 ? weight.toFixed(2) : ''}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ) : tokens.length > 15 ? (
        <div className="text-amber-500 text-sm">Please keep the sentence under 15 words for visualization.</div>
      ) : (
        <div className="text-[#94a3b8] text-sm">Type a sentence to visualize attention.</div>
      )}
    </div>
  )
}
