export interface World {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  category: 'foundations' | 'machine-learning' | 'deep-learning-genai' | 'bonus-content'
  isPremium?: boolean
}

export const WORLDS: World[] = [
  // --- STAGE 1: FOUNDATIONS ---
  {
    id: 'world-0',
    title: 'World 0 — AI Explorer',
    subtitle: 'High-Level Mindset',
    description: 'Deconstruct what AI actually is, narrow AI vs AGI, rule-based systems vs machine learning, and train your first classifier with zero code.',
    icon: '🌍',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    category: 'foundations'
  },
  {
    id: 'world-1',
    title: 'World 1 — Python for AI',
    subtitle: 'NumPy & Pandas Basics',
    description: 'Master variables, loops, functions, lists, and NumPy multidimensional slicing. Slice arrays and analyze datasets.',
    icon: '🐍',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    category: 'foundations'
  },
  {
    id: 'world-2',
    title: 'World 2 — Data Thinking',
    subtitle: 'Features & Data Cleaners',
    description: 'Learn structured features, scaling, train/val/test splits, data bias, and work in an interactive data-cleaning playground.',
    icon: '📊',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    category: 'foundations'
  },
  {
    id: 'world-3',
    title: 'World 3 — AI Superpowers',
    subtitle: 'Intuiting Mathematics',
    description: 'Explore the math underneath without fear: Vectors, Dot Products, Variance, objective loss formulations, and gradient sweeps.',
    icon: '📐',
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
    category: 'foundations'
  },

  // --- STAGE 2: CORE ML ---
  {
    id: 'world-4',
    title: 'World 4 — Machine Learning Academy',
    subtitle: 'Core Supervised Models',
    description: 'Master core models (Linear Regression, KNN, Naive Bayes, Decision Trees, Random Forests, XGBoost) through business applications.',
    icon: '🛡️',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    category: 'machine-learning',
    isPremium: true
  },
  {
    id: 'world-5',
    title: 'World 5 — Unsupervised Learning',
    subtitle: 'Clustering & Recommendations',
    description: 'Find structure in unlabeled datasets. Walk through K-Means clustering, DBSCAN density models, and Collaborative Filtering.',
    icon: '🌀',
    color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
    category: 'machine-learning',
    isPremium: true
  },

  // --- STAGE 3: DEEP LEARNING & GENAI ---
  {
    id: 'world-6',
    title: 'World 6 — Deep Learning',
    subtitle: 'Neural Networks & Backprop',
    description: 'Trace multi-layered neuron structures, backpropagation formulas, activation functions, and convolutional vision filters.',
    icon: '🧠',
    color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-7',
    title: 'World 7 — Natural Language Processing',
    subtitle: 'From Word2Vec to BERT',
    description: 'Deconstruct text embeddings, custom subword BPE tokenizers, self-attention calculations, and transformer architectures.',
    icon: '✍️',
    color: 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/30 text-fuchsia-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-8',
    title: 'World 8 — Computer Vision',
    subtitle: 'Object Detection & OCR',
    description: 'Understand convolutional segmentation, OCR document extraction, face tracking, and vision transformer grids.',
    icon: '👁️',
    color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-9',
    title: 'World 9 — Reinforcement Learning',
    subtitle: 'Policies & Agent Decisions',
    description: 'Construct Q-learning models, Deep Q networks, self-driving navigation parameters, and policy sweeps.',
    icon: '🕹️',
    color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-10',
    title: 'World 10 — MLOps Academy',
    subtitle: 'Model Registries & Drift',
    description: 'Deploy FastAPI microservices, monitor model drift, track experiment versions, and manage Docker containers.',
    icon: '⚙️',
    color: 'from-slate-500/20 to-zinc-500/20 border-slate-500/30 text-slate-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-11',
    title: 'World 11 — Generative AI Engineering',
    subtitle: 'Agents, MCP & Tool Calling',
    description: 'Architect multi-agent chains, link tool calls, run Model Context Protocol (MCP) integrations, and build prompt workflows.',
    icon: '✨',
    color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-12',
    title: 'World 12 — Build Like an AI Engineer',
    subtitle: 'Capstone Project Portfolio',
    description: 'Compile your portfolio of tangible products: Spam classifier, RAG search engine, and an autonomous browser controller.',
    icon: '🚀',
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-13',
    title: 'World 13 — LLM Alignment & Finetuning',
    subtitle: 'LoRA, PEFT & DPO Tuning',
    description: 'Learn parameter-efficient LLM finetuning via low-rank adapters (LoRA) and align models with human preference metrics (DPO).',
    icon: '⚖️',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    category: 'deep-learning-genai',
    isPremium: true
  },
  {
    id: 'world-14',
    title: 'World 14 — Generative Media & Diffusion',
    subtitle: 'Image Generation & DDPM',
    description: 'Construct denoising diffusion probabilistic models, manage noise schedules, and visual generative U-Net networks.',
    icon: '🎨',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    category: 'deep-learning-genai',
    isPremium: true
  },

  // --- STAGE 4: PREMIUM BONUS CONTENT ---
  {
    id: 'bonus-papers',
    title: 'AI Papers Club',
    subtitle: 'Landmark Architecture Papers',
    description: 'Deconstruct landmark papers (Attention Is All You Need, BERT, GPT, ResNet, YOLO) with guided annotations.',
    icon: '📄',
    color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-300',
    category: 'bonus-content',
    isPremium: true
  },
  {
    id: 'bonus-inside',
    title: 'Inside the Model',
    subtitle: 'Interactive Split-Room travels',
    description: 'Walk through algorithms from the inside. Trace decision split rooms and follow token vector projection lines.',
    icon: '🚪',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300',
    category: 'bonus-content',
    isPremium: true
  },
  {
    id: 'bonus-interviews',
    title: 'Interview Prep',
    subtitle: 'Case Studies & Code Runs',
    description: 'Master system design tradeoffs, complex matrix multiplications, and practice technical interview recruiter grids.',
    icon: '💼',
    color: 'from-emerald-500/20 to-blue-500/20 border-emerald-500/30 text-emerald-300',
    category: 'bonus-content',
    isPremium: true
  },
  {
    id: 'bonus-industry',
    title: 'AI in Industry',
    subtitle: 'Real-world Tech Architectures',
    description: 'Learn how Spotify recommendations, Tesla autopilot layers, and Uber ETAs operate in production.',
    icon: '🏭',
    color: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300',
    category: 'bonus-content',
    isPremium: true
  },
  {
    id: 'bonus-competitions',
    title: 'Guided Competitions',
    subtitle: 'Kaggle-style Challenges',
    description: 'Compete in guided datasets, debug validation loss graphs, and optimize training rates to top the boards.',
    icon: '🏁',
    color: 'from-rose-500/20 to-fuchsia-500/20 border-rose-500/30 text-rose-300',
    category: 'bonus-content',
    isPremium: true
  },
  {
    id: 'bonus-research',
    title: 'Research Lab',
    subtitle: 'Reasoning Models & Safety',
    description: 'Deconstruct latest models (Reasoning patterns, AI Safety constraints, inference latency scaling, and LoRA parameters).',
    icon: '🔬',
    color: 'from-zinc-500/20 to-slate-500/20 border-zinc-500/30 text-zinc-300',
    category: 'bonus-content',
    isPremium: true
  }
]
