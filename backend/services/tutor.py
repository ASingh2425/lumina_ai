import os

from openai import OpenAI

LEVEL_PROMPTS = {
    "beginner": (
        "Explain like you're talking to a curious 16-year-old with no ML background. "
        "Use analogies and simple language. No jargon without explaining it. 2-4 short paragraphs."
    ),
    "college": (
        "Explain at an undergraduate CS/ML level. Use precise terminology and connect to "
        "mathematical intuition. 2-4 paragraphs."
    ),
}

FALLBACK = {
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
}


def ask_tutor(question: str, level: str, context: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return FALLBACK.get(level, FALLBACK["beginner"])

    client = OpenAI(api_key=api_key)
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
