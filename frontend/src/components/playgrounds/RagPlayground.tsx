import { useState, useMemo } from 'react'

interface DocumentItem {
  id: number
  text: string
  similarities: Record<string, number> // query to similarity score
}

const QUERIES = [
  "What does a dog eat?",
  "Who painted the Mona Lisa?",
  "How does photosynthesis work?"
]

const DOCUMENTS: DocumentItem[] = [
  { id: 1, text: "Dogs are omnivores; they primarily eat meat, kibble, and safe vegetables.", similarities: { "What does a dog eat?": 0.88, "Who painted the Mona Lisa?": 0.08, "How does photosynthesis work?": 0.05 } },
  { id: 2, text: "The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.", similarities: { "What does a dog eat?": 0.11, "Who painted the Mona Lisa?": 0.94, "How does photosynthesis work?": 0.04 } },
  { id: 3, text: "Photosynthesis is the process used by plants to convert light energy into chemical energy.", similarities: { "What does a dog eat?": 0.06, "Who painted the Mona Lisa?": 0.05, "How does photosynthesis work?": 0.91 } },
  { id: 4, text: "Puppies require specially formulated high-protein food for growth.", similarities: { "What does a dog eat?": 0.76, "Who painted the Mona Lisa?": 0.12, "How does photosynthesis work?": 0.08 } },
  { id: 5, text: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.", similarities: { "What does a dog eat?": 0.09, "Who painted the Mona Lisa?": 0.89, "How does photosynthesis work?": 0.07 } }
]

export function RagPlayground() {
  const [selectedQuery, setSelectedQuery] = useState<string>(QUERIES[0])
  const [threshold, setThreshold] = useState<number>(0.65)
  const [pipelineStep, setPipelineStep] = useState<number>(1)

  // Retrieve documents that cross the threshold score
  const retrievedDocs = useMemo(() => {
    return DOCUMENTS.filter((doc) => doc.similarities[selectedQuery] >= threshold)
  }, [selectedQuery, threshold])

  // Generate mock LLM output based on retrieved facts
  const llmResponse = useMemo(() => {
    if (retrievedDocs.length === 0) {
      return "I do not have any relevant reference facts in my context to answer your question."
    }

    if (selectedQuery === "What does a dog eat?") {
      const hasDog = retrievedDocs.some((d) => d.id === 1)
      const hasPup = retrievedDocs.some((d) => d.id === 4)
      if (hasDog && hasPup) {
        return "Based on the retrieved facts, dogs eat meat, kibble, and vegetables, while puppies require high-protein food."
      }
      if (hasDog) {
        return "According to the context, dogs eat meat, kibble, and vegetables."
      }
      if (hasPup) {
        return "The retrieved facts indicate that puppies require specialized high-protein food."
      }
    }

    if (selectedQuery === "Who painted the Mona Lisa?") {
      const hasArtist = retrievedDocs.some((d) => d.id === 2)
      const hasDates = retrievedDocs.some((d) => d.id === 5)
      if (hasArtist && hasDates) {
        return "The Mona Lisa was painted by Italian artist Leonardo da Vinci between 1503 and 1519."
      }
      if (hasArtist) return "The Mona Lisa was painted by the Italian artist Leonardo da Vinci."
      if (hasDates) return "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519."
    }

    if (selectedQuery === "How does photosynthesis work?") {
      const hasPhoto = retrievedDocs.some((d) => d.id === 3)
      if (hasPhoto) {
        return "Based on the reference context, photosynthesis is the process plants use to convert light energy into chemical energy."
      }
    }

    return "I am sorry, but the retrieved context does not contain direct facts matching your exact query."
  }, [selectedQuery, retrievedDocs])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 select-none">
      
      {/* Selector and step headers */}
      <div className="flex flex-wrap gap-2 justify-between border-b border-[var(--color-border)] pb-3 mb-4 items-center">
        <span className="text-sm text-[#8b93a7]">RAG Retrieval & Generation Flow</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setPipelineStep(step)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                pipelineStep === step
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-overlay)] text-[#8b93a7] hover:text-white'
              }`}
            >
              Step {step}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive step display */}
      <div className="my-4 min-h-[220px]">
        {pipelineStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 1: User Query</h4>
            <p className="text-xs text-[#8b93a7]">Select a search query to route through the database embedding lookup:</p>
            <div className="space-y-2">
              {QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setSelectedQuery(q)
                    setPipelineStep(2) // auto progress to next step
                  }}
                  className={`w-full rounded-xl border p-3.5 text-left text-xs transition-colors ${
                    selectedQuery === q
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] text-[#8b93a7]'
                  }`}
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {pipelineStep === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 2: Vector Similarity Search</h4>
              <span className="text-[10px] text-amber-400 font-bold font-mono">Cutoff: ≥{threshold.toFixed(2)}</span>
            </div>
            
            {/* Threshold slider */}
            <div>
              <input
                type="range"
                min={0.3}
                max={0.95}
                step={0.05}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>

            {/* Documents database list */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {DOCUMENTS.map((doc) => {
                const score = doc.similarities[selectedQuery]
                const isSelected = score >= threshold

                return (
                  <div
                    key={doc.id}
                    className={`rounded-xl border p-2.5 text-[11px] leading-relaxed transition-all duration-300 ${
                      isSelected
                        ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-white'
                        : 'border-[var(--color-border)] opacity-40 text-[#8b93a7]'
                    }`}
                  >
                    <div className="flex justify-between font-mono font-bold mb-1">
                      <span>Doc #{doc.id}</span>
                      <span className={isSelected ? 'text-[var(--color-success)]' : 'text-[#8b93a7]'}>
                        Score: {score.toFixed(2)}
                      </span>
                    </div>
                    {doc.text}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {pipelineStep === 3 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 3: Context-Augmented Prompt</h4>
            <p className="text-xs text-[#8b93a7]">The retrieved facts are combined into a system instruction context:</p>
            <div className="rounded-xl border border-[var(--color-border)] bg-[#0a0c10] p-4 text-xs font-mono leading-relaxed text-[var(--color-accent-bright)] max-h-[160px] overflow-y-auto">
              <span className="text-amber-500 font-bold block mb-1"># SYSTEM PROMPT INJECTED:</span>
              Use the following factual documents to answer the user query:
              <br />
              {retrievedDocs.length > 0 ? (
                retrievedDocs.map((d, i) => (
                  <span key={d.id} className="text-white block mt-1.5">
                    [{i + 1}] {d.text}
                  </span>
                ))
              ) : (
                <span className="text-[var(--color-danger)] italic block mt-1">
                  [WARNING: No documents matched similarity threshold. Reference context is empty.]
                </span>
              )}
              <span className="text-amber-500 font-bold block mt-3"># USER QUERY:</span>
              {selectedQuery}
            </div>
          </div>
        )}

        {pipelineStep === 4 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 4: LLM Output Response</h4>
            <p className="text-xs text-[#8b93a7]">The final response generated by the LLM using the retrieved prompt data:</p>
            <div className="rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5 p-4 text-xs leading-relaxed text-[#e2e8f0]">
              <span className="text-[var(--color-success)] font-bold block mb-1">💬 LLM Answer:</span>
              &ldquo;{llmResponse}&rdquo;
            </div>
          </div>
        )}
      </div>

      {/* Navigation and tips */}
      <div className="mt-4 border-t border-[var(--color-border)] pt-4 flex items-center justify-between">
        <p className="text-[10px] text-[#8b93a7] max-w-[70%]">
          💡 <strong>Experiment:</strong> Adjust the threshold score. Setting it to <strong>0.90+</strong> avoids retrieving false facts, but might miss relevant ones (like puppies). Setting it to <strong>0.30</strong> retrieves everything, polluting the prompt.
        </p>
        <button
          type="button"
          onClick={() => {
            if (pipelineStep < 4) setPipelineStep(pipelineStep + 1)
            else setPipelineStep(1)
          }}
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2 text-[11px] font-semibold text-white transition-transform hover:scale-105 active:scale-95"
        >
          {pipelineStep === 4 ? 'Restart ↺' : 'Next Step →'}
        </button>
      </div>
    </div>
  )
}
