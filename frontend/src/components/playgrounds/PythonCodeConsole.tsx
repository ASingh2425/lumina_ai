import { useState } from 'react'

interface PythonCodeConsoleProps {
  initialCode: string
}

export function PythonCodeConsole({ initialCode }: PythonCodeConsoleProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [pyodideInstance, setPyodideInstance] = useState<any>(null)

  const loadPyodideScript = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).loadPyodide) {
        resolve((window as any).loadPyodide)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
      script.onload = () => {
        resolve((window as any).loadPyodide)
      }
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  const handleRun = async () => {
    setLoading(true)
    setOutput('Loading WebAssembly Python (Pyodide) environment...')
    try {
      let pyodide = pyodideInstance
      if (!pyodide) {
        const loadPyodideFn = await loadPyodideScript()
        pyodide = await loadPyodideFn({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
        })
        setOutput('Environment loaded. Installing NumPy package...')
        await pyodide.loadPackage('numpy')
        setPyodideInstance(pyodide)
      }

      setOutput('Executing Python runtime code...')
      
      // Setup stdout capture buffer in python
      pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
`)

      // Execute code script
      await pyodide.runPythonAsync(code)

      // Extract stdout log
      const stdOut = pyodide.runPython('sys.stdout.getvalue()')
      setOutput(stdOut || 'Script executed successfully. Output is empty.')
    } catch (err: any) {
      setOutput(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[#0a0c10] overflow-hidden flex flex-col font-mono text-xs md:text-sm">
      {/* Toolbar header */}
      <div className="flex items-center justify-between bg-black/40 px-4 py-2 border-b border-[var(--color-border)]">
        <span className="text-[#8b93a7] font-bold text-xs uppercase tracking-wider">⚡ WebAssembly Python Console</span>
        <button
          onClick={handleRun}
          disabled={loading}
          className="rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-3 py-1.5 text-xs font-bold text-black cursor-pointer transition-all"
        >
          {loading ? 'Running...' : 'Run Code ⚡'}
        </button>
      </div>

      {/* Code Textarea Editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        className="w-full bg-transparent p-4 text-[#a8d4a8] leading-relaxed resize-y focus:outline-none font-mono focus:ring-1 focus:ring-emerald-500/20"
      />

      {/* Run Output terminal log */}
      <div className="border-t border-[var(--color-border)] bg-black/60 p-4 text-[#c4cad8] min-h-[90px] max-h-[160px] overflow-y-auto whitespace-pre-wrap">
        <div className="text-[10px] text-[#8b93a7] uppercase tracking-wider mb-1.5 font-bold">Console Output:</div>
        <div className="font-mono text-xs leading-relaxed text-[#e2e8f0]">
          {output || 'Click "Run Code" to compile and view outputs.'}
        </div>
      </div>
    </div>
  )
}
