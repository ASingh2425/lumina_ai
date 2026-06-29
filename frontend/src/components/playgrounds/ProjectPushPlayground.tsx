import { useState } from 'react'

interface ProjectCode {
  filename: string
  code: string
  guideSteps: string[]
}

const PROJECT_DATASETS: Record<string, ProjectCode> = {
  'gradient-descent': {
    filename: 'MarieKondoLassoOptimizer.py',
    guideSteps: [
      "Let's write a regularized gradient descent optimizer.",
      "L1 (Lasso) acts like Marie Kondo: it evaluates feature weights and drives less helpful ones to exactly zero, throwing them away.",
      "L2 (Ridge) acts like a rubber band: it penalizes large weight spikes but keeps all variables around.",
      "We combine L1 and L2 gradients in the optimization update step."
    ],
    code: `import numpy as np

class MarieKondoOptimizer:
    def __init__(self, lr=0.01, lasso_l1=0.0, ridge_l2=0.0):
        self.lr = lr
        self.lasso = lasso_l1  # Marie Kondo (Lasso)
        self.ridge = ridge_l2  # Rubber Band (Ridge)
        self.theta = 0.0

    def optimize(self, gradient_fn, epochs=100):
        # Starts training
        for epoch in range(epochs):
            # Compute regularized gradient offsets
            l1_penalty = self.lasso * np.sign(self.theta)
            l2_penalty = self.ridge * self.theta
            
            # Update step: theta = theta - lr * (gradient + regularization)
            self.theta = self.theta - self.lr * (gradient_fn(self.theta) + l1_penalty + l2_penalty)
        return self.theta

if __name__ == "__main__":
    # Test optimizer
    # Loss: J(theta) = (theta - 3)^2, gradient dJ = 2*(theta - 3)
    grad = lambda t: 2 * (t - 3)
    
    # Marie Kondo Lasso regularization set to 0.5
    opt = MarieKondoOptimizer(lr=0.1, lasso_l1=0.5)
    final_theta = opt.optimize(grad, epochs=50)
    print(f"Optimized Theta: {final_theta:.4f} (Shrunk towards zero!)")
`
  },
  'rag-pipeline': {
    filename: 'NumpyCosSearchEngine.py',
    guideSteps: [
      "Let's build a Retrieval-Augmented Generation (RAG) Document Search Engine.",
      "Like an open-book helper, the search engine converts text facts into coordinates (embeddings).",
      "We calculate the Cosine Similarity (angle) between the query and database entries.",
      "Facts that exceed the cutoff score are retrieved and formatted into a System Prompt context."
    ],
    code: `import numpy as np

class NumpyRagSearch:
    def __init__(self, document_db):
        self.db = document_db
        # Vocabulary keys
        self.vocab = ["dog", "cat", "lisa", "painting", "vinci", "photosynthesis", "light", "energy"]

    def embed(self, text):
        # Convert text to basic token occurrence vectors
        words = text.lower().split()
        vec = [words.count(w) for w in self.vocab]
        norm = np.linalg.norm(vec)
        return np.array(vec) / (norm + 1e-9)

    def search(self, query, threshold=0.5):
        q_emb = self.embed(query)
        retrieved_facts = []
        
        for doc in self.db:
            d_emb = self.embed(doc)
            # Cosine similarity: dot product of normalized embeddings
            similarity = np.dot(q_emb, d_emb)
            if similarity >= threshold:
                retrieved_facts.append((doc, similarity))
                
        # Sort by similarity ranking
        return sorted(retrieved_facts, key=lambda x: x[1], reverse=True)

if __name__ == "__main__":
    db = [
        "Dogs primarily eat meat, kibble, and vegetables.",
        "Leonardo da Vinci painted the Mona Lisa in Florence.",
        "Photosynthesis converts light energy into chemical energy in plants."
    ]
    
    engine = NumpyRagSearch(db)
    results = engine.search("What does a puppy or dog eat?", threshold=0.6)
    print("Retrieved context documents:")
    for doc, score in results:
        print(f"- [{score:.2f}] {doc}")
`
  },
  'tokenizer': {
    filename: 'BpeSubwordTokenizer.py',
    guideSteps: [
      "Let's write a Byte-Pair Encoding (BPE) Subword Tokenizer.",
      "The tokenizer maps words to numeric IDs. For unseen words, it splits them into syllable-like segments.",
      "We train the tokenizer by scanning a training text and merging the most frequent adjacent character pairs.",
      "Unseen words are handled by falling back to base characters instead of throwing OOV errors."
    ],
    code: `import re, collections

class BpeTokenizer:
    def __init__(self, merges_count=10):
        self.merges_count = merges_count
        self.merges = {}

    def get_stats(self, vocab):
        pairs = collections.defaultdict(int)
        for word, freq in vocab.items():
            symbols = word.split()
            for i in range(len(symbols) - 1):
                pairs[symbols[i], symbols[i+1]] += freq
        return pairs

    def merge_vocab(self, pair, v_in):
        v_out = {}
        bigram = re.escape(' '.join(pair))
        p = re.compile(r'(?<!\\S)' + bigram + r'(?!\\S)')
        for word in v_in:
            w_out = p.sub(''.join(pair), word)
            v_out[w_out] = v_in[word]
        return v_out

    def train(self, corpus):
        # Convert text corpus to space-separated base characters
        vocab = {" ".join(w) + " </w>": freq for w, freq in collections.Counter(corpus.split()).items()}
        
        for i in range(self.merges_count):
            pairs = self.get_stats(vocab)
            if not pairs:
                break
            best_pair = max(pairs, key=pairs.get)
            vocab = self.merge_vocab(best_pair, vocab)
            self.merges[best_pair] = i
        return self.merges

if __name__ == "__main__":
    corpus = "learn learning neural networks neural networks are fun"
    tokenizer = BpeTokenizer(merges_count=8)
    merges = tokenizer.train(corpus)
    print("Trained merges vocabulary index:")
    for pair, merge_id in merges.items():
        print(f"Merge {merge_id}: {pair} -> {''.join(pair)}")
`
  }
}

interface ProjectPushPlaygroundProps {
  topic?: string // 'gradient-descent', 'rag-pipeline', 'tokenizer'
}

export function ProjectPushPlayground({ topic = 'gradient-descent' }: ProjectPushPlaygroundProps) {
  const project = PROJECT_DATASETS[topic] || PROJECT_DATASETS['gradient-descent']
  const [filename, setFilename] = useState(project.filename)
  const [commitMsg, setCommitMsg] = useState(`feat: add completed ${project.filename}`)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null)

  const handlePush = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          content: project.code,
          commit_message: commitMsg
        })
      })

      const data = await res.json()
      if (res.ok && data.status === 'ok') {
        setResult({
          status: 'success',
          message: `Successfully pushed! File written and pushed directly to your remote main branch. Commit: "${commitMsg}".`
        })
      } else {
        throw new Error(data.detail || 'Git operation failed')
      }
    } catch (err: any) {
      setResult({
        status: 'error',
        message: `Push failed: ${err.message || 'Make sure your local Git is initialized and connected to origin.'}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] overflow-hidden font-sans">
      
      {/* Playful Guide section */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-overlay)]">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>🎒</span> Playful Guided Blueprint
        </h4>
        <div className="space-y-2 text-xs leading-relaxed text-[#c4cad8]">
          {project.guideSteps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-[var(--color-accent-bright)] font-bold">[{idx + 1}]</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor view */}
      <div className="flex justify-between items-center bg-[#0d1117] border-b border-[var(--color-border)] px-4 py-2 text-xs text-[#8b93a7]">
        <div className="flex items-center gap-2 font-mono">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="ml-2 font-bold text-white">{filename}</span>
        </div>
      </div>
      <div className="bg-[#0a0c10] p-4 border-b border-[var(--color-border)] max-h-[180px] overflow-y-auto font-mono text-[11px] leading-relaxed text-[#a8d4a8]">
        <pre>{project.code}</pre>
      </div>

      {/* Push controls */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1">Target Filename:</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-xs outline-none focus:border-[var(--color-accent)] font-mono text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1">Commit Message:</label>
            <input
              type="text"
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-xs outline-none focus:border-[var(--color-accent)] font-mono text-white"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={loading || !filename || !commitMsg}
          onClick={handlePush}
          className="w-full rounded-xl bg-[var(--color-success)] py-3 text-xs font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 shadow-lg shadow-[var(--color-success)]/10"
        >
          {loading ? 'Committing & Pushing to GitHub...' : '🚀 Push Project to GitHub Portfolio'}
        </button>

        {/* Success / Error notification */}
        {result && (
          <div
            className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              result.status === 'success'
                ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-white'
                : 'border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[#f87171]'
            }`}
          >
            <strong>{result.status === 'success' ? '✓ Push Successful' : '✕ Operation Error'}</strong>
            <p className="mt-1 text-[#c4cad8]">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
