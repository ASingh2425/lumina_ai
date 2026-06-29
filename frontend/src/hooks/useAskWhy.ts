import { useState } from 'react'

type TutorLevel = 'age_10' | 'beginner' | 'college' | 'interview' | 'mathematical'

interface AskWhyResponse {
  answer: string
  level: string
}

const FALLBACK_ANSWERS: Record<string, Record<TutorLevel, string>> = {
  default: {
    age_10:
      'Imagine sorting your toys into boxes — some boxes are for cars, and some are for blocks. AI does this by grouping similar things together.',
    beginner:
      'Think of it like learning to ride a bike. You try, wobble, adjust, and slowly get better. ML models do the same — they try a prediction, see how wrong they were, and adjust.',
    college:
      'This concept relates to optimization in a loss landscape. The model iteratively updates parameters to minimize a differentiable objective function using gradient information.',
    interview:
      'To explain this in an interview, refer to parameter convergence and empirical tradeoffs. We balance learning step sizes (learning rate) to avoid local minima or gradient divergence.',
    mathematical:
      'The objective function J(θ) is minimized iteratively. The update rule is θ = θ - η * ∇J(θ), updating parameters in the direction of the steepest descent.',
  },
}

export function useAskWhy(context: string) {
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [level, setLevel] = useState<TutorLevel>('beginner')

  const ask = async (question: string) => {
    setLoading(true)
    setAnswer(null)

    try {
      const res = await fetch('/api/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, level, context }),
      })

      if (res.ok) {
        const data: AskWhyResponse = await res.json()
        setAnswer(data.answer)
      } else {
        throw new Error('API error')
      }
    } catch {
      const fallback = FALLBACK_ANSWERS.default[level]
      setAnswer(
        `${fallback}\n\n(Context: ${context}. Question: "${question}")\n\nTip: Connect the backend with an OpenAI API key for live AI tutoring.`,
      )
    }

    setLoading(false)
  }

  return { ask, answer, loading, level, setLevel }
}
