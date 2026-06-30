import { useState } from 'react'

export function NetflixSimulator() {
  const [modelType, setModelType] = useState<'decision-tree' | 'random-forest' | 'linear'>('decision-tree')
  const [maxDepth, setMaxDepth] = useState(5)
  const [numTrees, setNumTrees] = useState(10)
  const [features, setFeatures] = useState({
    watchHistory: true,
    ageSalary: false,
    clickTime: true,
    ratingSimilarity: true
  })
  
  const [deployed, setDeployed] = useState(false)
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    latency: 0,
    churnReduction: 0,
    revenueIncrease: 0
  })

  const handleDeploy = () => {
    setDeployed(true)
    
    // Simulate metrics calculation based on configurations
    let baseAccuracy = 60
    let baseLatency = 10
    
    // Feature factors
    let activeFeatures = Object.values(features).filter(Boolean).length
    baseAccuracy += activeFeatures * 5
    baseLatency += activeFeatures * 8

    if (modelType === 'linear') {
      baseAccuracy += 5
      baseLatency += 4
    } else if (modelType === 'decision-tree') {
      baseAccuracy += maxDepth * 3
      baseLatency += maxDepth * 5
    } else if (modelType === 'random-forest') {
      baseAccuracy += (maxDepth * 2.5) + (numTrees * 0.8)
      baseLatency += (maxDepth * 4) + (numTrees * 2.5)
    }

    // Limit maximums
    const finalAccuracy = Math.min(Math.round(baseAccuracy), 98)
    const finalLatency = Math.min(Math.round(baseLatency), 250)
    
    // Churn is correlated with accuracy and latency (high latency increases churn!)
    const latencyPenalty = Math.max(0, (finalLatency - 80) * 0.15)
    const finalChurn = Math.max(0.2, ((finalAccuracy - 60) * 0.45) - latencyPenalty)
    
    // Revenue is correlated with churn reduction
    const finalRevenue = Math.max(0.5, finalChurn * 12.5)

    setMetrics({
      accuracy: finalAccuracy,
      latency: finalLatency,
      churnReduction: parseFloat(finalChurn.toFixed(1)),
      revenueIncrease: parseFloat(finalRevenue.toFixed(1))
    })
  }

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8 space-y-6 text-white">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="rounded-full bg-red-500/25 border border-red-500/30 px-3 py-0.5 text-[10px] font-bold text-red-400 uppercase tracking-widest">
            Netflix AI Lab
          </span>
          <h3 className="text-xl font-bold mt-1 text-white">Algorithm Recommendation Simulator</h3>
        </div>
        <div className="text-right sm:text-right text-xs text-[#8b93a7]">
          Task: **Reduce Subscriber Churn & Optimize Latency**
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Parameters Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-bright)]">
              1. Choose Recommendation Engine
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'linear', name: 'Linear CF' },
                { id: 'decision-tree', name: 'Decision Tree' },
                { id: 'random-forest', name: 'Random Forest' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setModelType(m.id as any)
                    setDeployed(false)
                  }}
                  className={`rounded-xl border p-3 text-center text-xs font-semibold transition-all cursor-pointer ${
                    modelType === m.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-surface-overlay)] text-[#8b93a7]'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model specific sliders */}
          {modelType !== 'linear' && (
            <div className="space-y-4 border-t border-[var(--color-border)] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-bright)]">
                2. Tweak Hyper-parameters
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8b93a7]">
                  <span>Max Depth Limit: <strong>{maxDepth} layers</strong></span>
                  <span>(Controls model complexity)</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={maxDepth}
                  onChange={(e) => {
                    setMaxDepth(parseInt(e.target.value))
                    setDeployed(false)
                  }}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>

              {modelType === 'random-forest' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8b93a7]">
                    <span>Number of Trees: <strong>{numTrees} estimators</strong></span>
                    <span>(More trees = higher accuracy, slower speed)</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={numTrees}
                    onChange={(e) => {
                      setNumTrees(parseInt(e.target.value))
                      setDeployed(false)
                    }}
                    className="w-full accent-[var(--color-accent)]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Feature Selector */}
          <div className="space-y-4 border-t border-[var(--color-border)] pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-bright)]">
              3. Select Dataset Features
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'watchHistory', label: 'Watch History' },
                { id: 'ageSalary', label: 'User Demographics' },
                { id: 'clickTime', label: 'Time-of-day click' },
                { id: 'ratingSimilarity', label: 'Genre Ratings' }
              ].map((f) => {
                const key = f.id as keyof typeof features
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFeatures({ ...features, [key]: !features[key] })
                      setDeployed(false)
                    }}
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs text-left transition-all cursor-pointer ${
                      features[key]
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-white'
                        : 'border-[var(--color-border)] text-[#8b93a7] hover:bg-[var(--color-surface-overlay)]'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span>{features[key] ? '✅' : '❌'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleDeploy}
            className="w-full rounded-2xl bg-red-600 hover:bg-red-500 py-3.5 text-sm font-extrabold text-white transition-all shadow-lg cursor-pointer"
          >
            🚀 Deploy Recommendation Engine
          </button>
        </div>

        {/* Right Side: Performance Dashboard */}
        <div className="flex flex-col justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-overlay)] p-6 text-center min-h-[300px]">
          {!deployed ? (
            <div className="space-y-3 py-12">
              <span className="text-5xl block animate-pulse">⚙️</span>
              <h4 className="font-extrabold text-white">System Standby</h4>
              <p className="text-xs text-[#8b93a7] max-w-xs mx-auto leading-relaxed">
                Tweak parameters on the left and click **Deploy** to stream simulated subscriber traffic.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h4 className="font-extrabold text-sm text-red-400 uppercase tracking-widest">
                Production Server Metrics
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[var(--color-border)] bg-black/20 p-4">
                  <span className="text-[10px] text-[#8b93a7] font-semibold block uppercase">Model Accuracy</span>
                  <span className="text-2xl font-black text-white block mt-1">{metrics.accuracy}%</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Good Fit</span>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-black/20 p-4">
                  <span className="text-[10px] text-[#8b93a7] font-semibold block uppercase">Query Latency</span>
                  <span className={`text-2xl font-black block mt-1 ${metrics.latency > 150 ? 'text-red-400' : metrics.latency > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {metrics.latency} ms
                  </span>
                  <span className="text-[10px] text-[#8b93a7] mt-1 block">Limit: 100ms</span>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-black/20 p-4">
                  <span className="text-[10px] text-[#8b93a7] font-semibold block uppercase">Churn Reduction</span>
                  <span className="text-2xl font-black text-emerald-400 block mt-1">-{metrics.churnReduction}%</span>
                  <span className="text-[10px] text-[#8b93a7] mt-1 block">Lower is better</span>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-black/20 p-4">
                  <span className="text-[10px] text-[#8b93a7] font-semibold block uppercase">Est. Revenue Lift</span>
                  <span className="text-2xl font-black text-white block mt-1">+${metrics.revenueIncrease}M</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Monthly</span>
                </div>
              </div>

              {/* Churn Warning Overlay if Latency is too high */}
              {metrics.latency > 100 && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-300 leading-relaxed text-left flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚠️</span>
                  <span>
                    **High Latency Penalty:** Server response latency exceeds **100ms**! App experiences lag, increasing subscriber bounce rates and offsetting recommendation accuracy gains. Try reducing **Max Depth** or **Trees count**!
                  </span>
                </div>
              )}

              {/* Success target summary */}
              {metrics.accuracy > 85 && metrics.latency <= 100 && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 leading-relaxed text-left flex items-start gap-2.5 animate-bounce">
                  <span className="text-base shrink-0">🎉</span>
                  <span>
                    **Optimal System State!** High model validation accuracy with rapid latency response times. Excellent architecture choice!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
