import os

from openai import OpenAI

LEVEL_PROMPTS = {
    "age_10": (
        "Explain like you are talking to a curious 10-year-old. Use extremely creative everyday analogies "
        "(like baking, playing with blocks, or sports). Keep sentences short and simple. No jargon at all. 2-3 paragraphs."
    ),
    "beginner": (
        "Explain like you're talking to a curious 16-year-old with no ML background. "
        "Use analogies and simple language. No jargon without explaining it. 2-4 short paragraphs."
    ),
    "college": (
        "Explain at an undergraduate CS/ML level. Use precise terminology and connect to "
        "mathematical intuition. 2-4 paragraphs."
    ),
    "interview": (
        "Explain as a direct, concise response suited for a technical machine learning interview. "
        "Highlight tradeoffs, complexity (time/space), and practical industry considerations. 2-3 paragraphs."
    ),
    "mathematical": (
        "Explain from first-principles mathematics. Highlight the objective function, derivatives/gradients, "
        "minimization/optimization formulas, and proof intuition where applicable. Use inline LaTeX-style notation. 2-4 paragraphs."
    ),
}

FALLBACK = {
    "age_10": (
        "Imagine you have a toy box and you want to put all the blocks in one pile and all the soft toys in another. "
        "You group them because they feel the same! Machine learning is just finding similar friends for things."
    ),
    "beginner": (
        "Think of it like adjusting a recipe — you taste, adjust one ingredient, taste again. "
        "Machine learning does the same loop: predict, measure error, adjust. Small careful steps "
        "work better than huge reckless ones."
    ),
    "college": (
        "This relates to iterative optimization over a differentiable loss landscape. Parameters "
        "are updated proportional to the negative gradient, with step size controlled by the "
        "learning rate hyperparameter."
    ),
    "interview": (
        "We optimize parameters iteratively. High learning rates risk gradient divergence, while excessively low rates "
        "lead to sub-optimal local minima. Batch size choices introduce standard bias-variance tradeoffs."
    ),
    "mathematical": (
        "Given a differentiable loss function J(θ), parameters are updated iteratively via "
        "θ_(t+1) = θ_t − η * ∇J(θ_t), where η is the step size. We select η such that the Lipschitz gradient bound is satisfied."
    ),
}

import requests

def call_gemini(question: str, level: str, context: str, api_key: str) -> str:
    system = LEVEL_PROMPTS.get(level, LEVEL_PROMPTS["beginner"])
    user_msg = f"Context: {context}\n\nQuestion: {question}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": user_msg}]
        }],
        "systemInstruction": {
            "parts": [{"text": system}]
        },
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 400
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"[GEMINI API ERROR: {str(e)}]\n\nFallback concept review:\n{FALLBACK.get(level, FALLBACK['beginner'])}"

def ask_tutor(question: str, level: str, context: str) -> str:
    # 1. Try Gemini API if key is present (Free Tier Option)
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        return call_gemini(question, level, context, gemini_key)

    # 2. Try OpenAI API if key is present
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            client = OpenAI(api_key=openai_key)
            system = LEVEL_PROMPTS.get(level, LEVEL_PROMPTS["beginner"])
            user_msg = f"Context: {context}\n\nQuestion: {question}"

            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_msg},
                ],
                max_tokens=400,
                temperature=0.7,
            )
            return response.choices[0].message.content or FALLBACK[level]
        except Exception as e:
            return f"[OPENAI API ERROR: {str(e)}]\n\nFallback concept review:\n{FALLBACK.get(level, FALLBACK['beginner'])}"

    # 3. Offline Mock Fallback
    fallback_desc = FALLBACK.get(level, FALLBACK["beginner"])
    return (
        f"[OFFLINE MOCK RESPONSE] Configure `GEMINI_API_KEY` (Free) or `OPENAI_API_KEY` "
        f"in `backend/.env` to get live AI answers.\n\n"
        f"Regarding your question: \"{question}\"\n\n"
        f"Here is a concept review ({level}):\n{fallback_desc}"
    )

