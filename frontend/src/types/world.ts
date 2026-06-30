export interface World {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  isPremium?: boolean
}

export const WORLDS: World[] = [
  {
    id: 'world-0',
    title: 'World 0 — AI Explorer',
    subtitle: 'High-Level Mindset',
    description: 'Deconstruct what AI actually is, narrow AI vs AGI, rule-based systems vs machine learning, and train your first classifier with zero code.',
    icon: '🌍',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400'
  },
  {
    id: 'world-1',
    title: 'World 1 — Thinking Like Data',
    subtitle: 'Features & Cleaners',
    description: 'Learn rows, columns, features, and image/audio token shapes. Fix messy datasets, adjust feature values, and identify algorithmic bias.',
    icon: '📊',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
  },
  {
    id: 'world-2',
    title: 'World 2 — AI Superpowers',
    subtitle: 'Intuiting Mathematics',
    description: 'Explore the math underneath without fear: Vectors, Multi-dimensional Distance, Variance, objective loss formulations, and gradient sweeps.',
    icon: '📐',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
  },
  {
    id: 'world-3',
    title: 'World 3 — Machine Learning Academy',
    subtitle: 'Core Algorithms',
    description: 'Master core models (Regression, KNN, Decision Trees, DBSCAN, Random Forest) through target application business requirements.',
    icon: '🛡️',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    isPremium: true
  },
  {
    id: 'world-4',
    title: 'World 4 — Deep Learning',
    subtitle: 'Neural Architectures',
    description: 'Trace visual signals: multi-layered neuron structures, backpropagation formulas, convolutional filters, and deep face-recognition grids.',
    icon: '🧠',
    color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-400',
    isPremium: true
  },
  {
    id: 'world-5',
    title: 'World 5 — Modern AI',
    subtitle: 'Generative Models & Agents',
    description: 'Deep dive into LLM attention weights, custom byte-pair tokenizers, Vector DB chunk scores, and tool-calling Agent environments.',
    icon: '✨',
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
    isPremium: true
  }
]
