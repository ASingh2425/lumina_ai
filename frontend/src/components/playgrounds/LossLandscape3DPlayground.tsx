import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Non-convex loss function approximation (e.g. Ackley-like or simple sin/cos mix)
function lossFunction(x: number, y: number) {
  return Math.sin(x * 1.5) * Math.cos(y * 1.5) + (x * x + y * y) * 0.1
}

function computeGradient(x: number, y: number) {
  const h = 0.01
  const dx = (lossFunction(x + h, y) - lossFunction(x - h, y)) / (2 * h)
  const dy = (lossFunction(x, y + h) - lossFunction(x, y - h)) / (2 * h)
  return { dx, dy }
}

function Surface() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, 50, 50)
    geo.rotateX(-Math.PI / 2) // Lay flat
    
    const pos = geo.attributes.position
    const colors = []
    
    // Calculate heights and colors
    let minZ = Infinity, maxZ = -Infinity
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getZ(i) // it's Z because we rotated X
      const z = lossFunction(x, y)
      pos.setY(i, z)
      
      minZ = Math.min(minZ, z)
      maxZ = Math.max(maxZ, z)
    }
    
    // Assign colors based on height
    const color = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const h = pos.getY(i)
      const normalized = (h - minZ) / (maxZ - minZ)
      // from blue (low) to red (high)
      color.setHSL(0.6 - (normalized * 0.6), 1, 0.5)
      colors.push(color.r, color.g, color.b)
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} wireframe={false} opacity={0.9} transparent />
    </mesh>
  )
}

function Ball({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  
  // Smoothly interpolate position for visual appeal
  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...position), 0.1)
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="white" emissive="#ffffff" emissiveIntensity={0.5} />
    </mesh>
  )
}

export function LossLandscape3DPlayground() {
  const startPos = { x: 3, y: 3 }
  const [pos, setPos] = useState(startPos)
  const [optimizer, setOptimizer] = useState<'SGD' | 'Adam'>('Adam')
  const [lr] = useState(0.2)
  
  // Optimizer state
  const m = useRef({ x: 0, y: 0 })
  const v = useRef({ x: 0, y: 0 })
  const t = useRef(0)

  const step = () => {
    const { dx, dy } = computeGradient(pos.x, pos.y)
    
    if (optimizer === 'SGD') {
      setPos(p => ({
        x: p.x - lr * dx,
        y: p.y - lr * dy
      }))
    } else {
      // Adam
      const beta1 = 0.9, beta2 = 0.999, eps = 1e-8
      t.current += 1
      
      m.current.x = beta1 * m.current.x + (1 - beta1) * dx
      m.current.y = beta1 * m.current.y + (1 - beta1) * dy
      
      v.current.x = beta2 * v.current.x + (1 - beta2) * dx * dx
      v.current.y = beta2 * v.current.y + (1 - beta2) * dy * dy
      
      const mHatX = m.current.x / (1 - Math.pow(beta1, t.current))
      const mHatY = m.current.y / (1 - Math.pow(beta1, t.current))
      const vHatX = v.current.x / (1 - Math.pow(beta2, t.current))
      const vHatY = v.current.y / (1 - Math.pow(beta2, t.current))
      
      setPos(p => ({
        x: p.x - (lr * mHatX) / (Math.sqrt(vHatX) + eps),
        y: p.y - (lr * mHatY) / (Math.sqrt(vHatY) + eps)
      }))
    }
  }

  const reset = () => {
    setPos(startPos)
    m.current = { x: 0, y: 0 }
    v.current = { x: 0, y: 0 }
    t.current = 0
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm flex flex-col overflow-hidden h-[500px]">
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center z-10 bg-[var(--color-surface)]">
        <div>
          <h3 className="text-lg font-bold text-white">3D Loss Landscape</h3>
          <p className="text-xs text-[#94a3b8]">Drag to rotate. See how Adam navigates the valley vs SGD.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <select 
            value={optimizer}
            onChange={(e) => { setOptimizer(e.target.value as any); reset(); }}
            className="bg-[var(--color-surface-overlay)] text-white text-sm border border-[var(--color-border)] rounded p-1"
          >
            <option value="SGD">SGD</option>
            <option value="Adam">Adam</option>
          </select>
          
          <button onClick={step} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">
            Step
          </button>
          
          <button onClick={reset} className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded">
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative cursor-move bg-[#0f172a]">
        <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Surface />
          <Ball position={[pos.x, lossFunction(pos.x, pos.y) + 0.2, pos.y]} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
          />
        </Canvas>
        
        <div className="absolute bottom-4 left-4 text-xs font-mono text-white/50 bg-black/40 px-2 py-1 rounded pointer-events-none">
          Pos: ({pos.x.toFixed(2)}, {pos.y.toFixed(2)}) | Loss: {lossFunction(pos.x, pos.y).toFixed(3)}
        </div>
      </div>
    </div>
  )
}
