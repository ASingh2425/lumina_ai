import { useState, useMemo } from 'react'

export function TokenizerPlayground() {
  const [inputText, setInputText] = useState<string>("learning neural networks is fun")
  const [vocabScale, setVocabScale] = useState<number>(100) // 0 to 300 scale

  // Visual BPE chunking logic mapping text depending on trained merges (represented by vocabScale)
  const tokenChunks = useMemo(() => {
    if (!inputText.trim()) return []

    // Clean up input
    const text = inputText.toLowerCase().replace(/[^a-z0-9\s]/g, '')
    const words = text.split(/\s+/)

    const chunks: { text: string; id: number }[] = []
    let idCounter = 100

    words.forEach((word) => {
      // Basic mock rules for Byte-Pair Encoding merges:
      if (vocabScale < 50) {
        // Individual character level
        for (let i = 0; i < word.length; i++) {
          chunks.push({ text: word[i], id: idCounter++ })
        }
      } else if (vocabScale < 150) {
        // Subword syllable level merges
        let remaining = word
        while (remaining.length > 0) {
          if (remaining.startsWith("learn")) {
            chunks.push({ text: "learn", id: 245 })
            remaining = remaining.slice(5)
          } else if (remaining.startsWith("ing")) {
            chunks.push({ text: "ing", id: 188 })
            remaining = remaining.slice(3)
          } else if (remaining.startsWith("neur")) {
            chunks.push({ text: "neur", id: 312 })
            remaining = remaining.slice(4)
          } else if (remaining.startsWith("al")) {
            chunks.push({ text: "al", id: 122 })
            remaining = remaining.slice(2)
          } else if (remaining.startsWith("net")) {
            chunks.push({ text: "net", id: 201 })
            remaining = remaining.slice(3)
          } else if (remaining.startsWith("work")) {
            chunks.push({ text: "work", id: 254 })
            remaining = remaining.slice(4)
          } else {
            // Take first character
            chunks.push({ text: remaining[0], id: idCounter++ })
            remaining = remaining.slice(1)
          }
        }
      } else if (vocabScale < 250) {
        // High frequency word merges
        let remaining = word
        if (remaining === "learning") {
          chunks.push({ text: "learning", id: 412 })
        } else if (remaining === "neural") {
          chunks.push({ text: "neural", id: 489 })
        } else if (remaining === "networks") {
          chunks.push({ text: "net", id: 201 })
          chunks.push({ text: "works", id: 390 })
        } else if (remaining === "is" || remaining === "fun") {
          chunks.push({ text: remaining, id: remaining === "is" ? 104 : 330 })
        } else {
          // Chunk normal
          for (let i = 0; i < remaining.length; i++) {
            chunks.push({ text: remaining[i], id: idCounter++ })
          }
        }
      } else {
        // Full vocab coverage merges
        let remaining = word
        const mappings: Record<string, number> = {
          learning: 605,
          neural: 712,
          networks: 884,
          is: 104,
          fun: 330
        }
        if (mappings[remaining]) {
          chunks.push({ text: remaining, id: mappings[remaining] })
        } else {
          chunks.push({ text: remaining, id: idCounter + 200 })
        }
      }
      // Add space token cell except for last
      chunks.push({ text: " ", id: 32 }) // 32 = standard ASCII space
    })

    // Remove trailing space
    if (chunks.length > 0 && chunks[chunks.length - 1].text === " ") {
      chunks.pop()
    }

    return chunks
  }, [inputText, vocabScale])

  // Colors list to style token block tags
  const colors = [
    'bg-red-500/10 border-red-500/30 text-red-300',
    'bg-blue-500/10 border-blue-500/30 text-blue-300',
    'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    'bg-amber-500/10 border-amber-500/30 text-amber-300',
    'bg-purple-500/10 border-purple-500/30 text-purple-300',
    'bg-teal-500/10 border-teal-500/30 text-teal-300',
    'bg-pink-500/10 border-pink-500/30 text-pink-300',
  ]

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 select-none">
      <div className="flex flex-wrap gap-2 justify-between border-b border-[var(--color-border)] pb-3 mb-4 items-center">
        <span className="text-sm text-[#8b93a7]">Token Segmentation Visualizer</span>
        <span className="rounded-lg bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-accent-bright)]">
          Vocabulary Scale: {vocabScale} merges
        </span>
      </div>

      {/* Input textbox */}
      <div className="mb-4">
        <label className="text-xs text-[#8b93a7] font-semibold block mb-1">Type something to tokenize:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type sentence..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      {/* Segmented tokens rendering */}
      <div className="my-6">
        <span className="text-xs text-[#8b93a7] font-semibold block mb-2">Tokenized Output Grid:</span>
        <div className="flex flex-wrap gap-1.5 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] min-h-[90px] items-center justify-start">
          {tokenChunks.length > 0 ? (
            tokenChunks.map((chunk, idx) => {
              if (chunk.text === " ") {
                return (
                  <div key={idx} className="h-6 w-3 border border-dashed border-[var(--color-border)] rounded flex items-center justify-center text-[9px] text-[#4a5568] font-mono">
                    ␣
                  </div>
                )
              }

              const colorClass = colors[chunk.id % colors.length]
              return (
                <div
                  key={idx}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-mono font-bold flex flex-col items-center leading-none ${colorClass}`}
                >
                  <span>{chunk.text}</span>
                  <span className="text-[8px] opacity-60 mt-1">ID:{chunk.id}</span>
                </div>
              )
            })
          ) : (
            <span className="text-xs text-[#8b93a7] italic">Type text above to test tokenization.</span>
          )}
        </div>
      </div>

      {/* Vocabulary Size Slider */}
      <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span>Vocabulary Merge Count</span>
            <span className="font-mono text-[var(--color-accent-bright)]">Vocab Scale = {vocabScale}</span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={25}
            value={vocabScale}
            onChange={(e) => setVocabScale(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <p className="text-xs text-[#8b93a7] leading-relaxed">
          💡 <strong>How it works:</strong> Byte-Pair Encoding starts with characters (Vocab Scale &lt; 50). As training merges are learned (moving slider right), common combinations fuse into subwords (like <code>"ing"</code>) and finally complete words (like <code>"learning"</code>). This allows LLMs to handle new, unseen words by breaking them down!
        </p>
      </div>
    </div>
  )
}
