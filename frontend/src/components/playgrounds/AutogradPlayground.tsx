import { useState } from 'react'

interface Node {
  id: string
  label: string
  val: number
  grad: number
  deps: { id: string; weight?: number; op?: string }[]
}

export function AutogradPlayground() {
  const [x, setX] = useState<number>(2)
  const [y, setY] = useState<number>(-3)
  const [w, setW] = useState<number>(10)
  
  const [nodes, setNodes] = useState<Node[]>([])
  const [step, setStep] = useState<'input' | 'forward' | 'backward'>('input')

  const handleForward = () => {
    const multVal = x * y
    const zVal = multVal + w
    
    setNodes([
      { id: 'x', label: 'x', val: x, grad: 0, deps: [] },
      { id: 'y', label: 'y', val: y, grad: 0, deps: [] },
      { id: 'w', label: 'w', val: w, grad: 0, deps: [] },
      { id: 'mult', label: 'x * y', val: multVal, grad: 0, deps: [{id: 'x', op: '*'}, {id: 'y', op: '*'}] },
      { id: 'z', label: 'z = (x*y) + w', val: zVal, grad: 0, deps: [{id: 'mult', op: '+'}, {id: 'w', op: '+'}] }
    ])
    setStep('forward')
  }

  const handleBackward = () => {
    // Basic backprop for z = x * y + w
    // dz/dz = 1
    // dz/dmult = 1, dz/dw = 1
    // dz/dx = dz/dmult * y = y
    // dz/dy = dz/dmult * x = x
    
    const multVal = x * y
    const zVal = multVal + w
    
    setNodes([
      { id: 'x', label: 'x', val: x, grad: y, deps: [] },
      { id: 'y', label: 'y', val: y, grad: x, deps: [] },
      { id: 'w', label: 'w', val: w, grad: 1, deps: [] },
      { id: 'mult', label: 'x * y', val: multVal, grad: 1, deps: [{id: 'x', op: '*'}, {id: 'y', op: '*'}] },
      { id: 'z', label: 'z = (x*y) + w', val: zVal, grad: 1, deps: [{id: 'mult', op: '+'}, {id: 'w', op: '+'}] }
    ])
    setStep('backward')
  }

  const reset = () => {
    setNodes([])
    setStep('input')
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Mini-PyTorch Autograd Engine</h3>
        <p className="text-sm text-[#94a3b8]">
          Let's build a computational graph for the equation <code>z = x * y + w</code>.
          Watch how PyTorch's <code>.backward()</code> computes gradients flowing backwards.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Input x</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            disabled={step !== 'input'}
            className="w-full rounded-lg bg-[var(--color-surface-overlay)] px-3 py-2 text-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Input y</label>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
            disabled={step !== 'input'}
            className="w-full rounded-lg bg-[var(--color-surface-overlay)] px-3 py-2 text-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#94a3b8] mb-1">Input w</label>
          <input
            type="number"
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            disabled={step !== 'input'}
            className="w-full rounded-lg bg-[var(--color-surface-overlay)] px-3 py-2 text-white border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-4">
        {step === 'input' && (
          <button
            onClick={handleForward}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Run Forward Pass (Compute Output)
          </button>
        )}
        {step === 'forward' && (
          <button
            onClick={handleBackward}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Run Backward Pass (.backward())
          </button>
        )}
        {step !== 'input' && (
          <button
            onClick={reset}
            className="rounded-lg bg-[var(--color-surface-overlay)] px-4 py-2 text-sm font-semibold text-white border border-[var(--color-border)] hover:bg-[#2a303c] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {nodes.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[#0f172a] p-6 mt-4 relative overflow-hidden flex flex-col items-center gap-8">
          {/* Top level: Output z */}
          <div className="flex justify-center w-full relative z-10">
             <div className="flex flex-col items-center bg-blue-900/40 border border-blue-500 rounded p-3 min-w-[150px]">
                <span className="text-sm font-bold text-blue-300">z (Output)</span>
                <span className="text-white mt-1 text-lg">{nodes.find(n => n.id === 'z')?.val.toFixed(2)}</span>
                {step === 'backward' && (
                   <span className="text-xs text-emerald-400 mt-1 font-mono">grad: {nodes.find(n => n.id === 'z')?.grad.toFixed(2)}</span>
                )}
             </div>
          </div>
          
          {/* Middle level: mult, w */}
          <div className="flex justify-around w-full relative z-10 max-w-md">
             <div className="flex flex-col items-center bg-purple-900/40 border border-purple-500 rounded p-3 min-w-[120px]">
                <span className="text-sm font-bold text-purple-300">x * y</span>
                <span className="text-white mt-1 text-lg">{nodes.find(n => n.id === 'mult')?.val.toFixed(2)}</span>
                {step === 'backward' && (
                   <span className="text-xs text-emerald-400 mt-1 font-mono">grad: {nodes.find(n => n.id === 'mult')?.grad.toFixed(2)}</span>
                )}
             </div>
             
             <div className="flex flex-col items-center bg-slate-800 border border-slate-600 rounded p-3 min-w-[120px]">
                <span className="text-sm font-bold text-slate-300">w</span>
                <span className="text-white mt-1 text-lg">{nodes.find(n => n.id === 'w')?.val.toFixed(2)}</span>
                {step === 'backward' && (
                   <span className="text-xs text-emerald-400 mt-1 font-mono">grad: {nodes.find(n => n.id === 'w')?.grad.toFixed(2)}</span>
                )}
             </div>
          </div>

          {/* Bottom level: x, y */}
          <div className="flex justify-start pl-[20%] w-full relative z-10 max-w-md gap-8">
             <div className="flex flex-col items-center bg-slate-800 border border-slate-600 rounded p-3 min-w-[120px]">
                <span className="text-sm font-bold text-slate-300">x</span>
                <span className="text-white mt-1 text-lg">{nodes.find(n => n.id === 'x')?.val.toFixed(2)}</span>
                {step === 'backward' && (
                   <span className="text-xs text-emerald-400 mt-1 font-mono">grad: {nodes.find(n => n.id === 'x')?.grad.toFixed(2)}</span>
                )}
             </div>
             
             <div className="flex flex-col items-center bg-slate-800 border border-slate-600 rounded p-3 min-w-[120px]">
                <span className="text-sm font-bold text-slate-300">y</span>
                <span className="text-white mt-1 text-lg">{nodes.find(n => n.id === 'y')?.val.toFixed(2)}</span>
                {step === 'backward' && (
                   <span className="text-xs text-emerald-400 mt-1 font-mono">grad: {nodes.find(n => n.id === 'y')?.grad.toFixed(2)}</span>
                )}
             </div>
          </div>
          
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none border-t border-b border-[var(--color-border)]" style={{ background: 'linear-gradient(180deg, transparent 49%, var(--color-border) 50%, transparent 51%)' }}></div>
        </div>
      )}

      {step === 'backward' && (
         <div className="mt-4 p-4 rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-border)] text-sm text-[#c4cad8]">
            <p><strong>Notice the Gradients:</strong></p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
               <li>The derivative of <code className="text-pink-400">z</code> with respect to itself is 1.00</li>
               <li>Since <code className="text-pink-400">z = (x*y) + w</code>, the derivative flowing into <code className="text-purple-400">x*y</code> and <code className="text-slate-300">w</code> is 1.00 (addition routes gradients equally).</li>
               <li>For the multiplication node <code className="text-purple-400">x*y</code>, the gradient of <code className="text-slate-300">x</code> is <code className="text-slate-300">y</code> (and vice versa) multiplied by the incoming gradient from above.</li>
               <li>Thus, grad(x) = {y} * 1 = {y.toFixed(2)} and grad(y) = {x} * 1 = {x.toFixed(2)}.</li>
            </ul>
         </div>
      )}
    </div>
  )
}
