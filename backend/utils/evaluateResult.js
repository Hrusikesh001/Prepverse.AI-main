import axios from 'axios';

export async function evaluateResult({ questions, answers }) {
  if (!questions || !answers || questions.length !== answers.length) {
    throw new Error("Questions and answers must be provided and of equal length.");
  }

  const qaBlock = questions
    .map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${answers[i]}`)
    .join("\n\n");

  const prompt = `
    You are an expert technical interview evaluator.

    Evaluate the candidate's answers to the following interview questions.

    Instructions:

    1. For each question-answer pair, write a **two-line review**:
      - Line 1: Assess how well the candidate answered the question.
      - Line 2: Suggest **specific topics or concepts** the candidate should improve, based on the question and answer.

    2. Assign a **score out of 10** (integer only) for each answer, based on clarity, completeness, and technical correctness.

    3. At the end, write an **"overAllReview"** with **exactly two lines**:
      - Line 1: Summarize how the candidate performed overall.
      - Line 2: Mention the candidate’s key strengths and weaknesses, based on the provided answers.

    Rules:
    - If an answer is missing, vague, or irrelevant (e.g. “Answer not provided” or “I will not answer this”), state that clearly and assign a score of **0**.
    - Do **not** repeat the original questions or answers in your review.
    - Respond **strictly** in the following JSON format with no extra commentary:

    {
      "reviews": [
        {
          "review": "Two-line review for Q1.",
          "score": 7
        },
        {
          "review": "Two-line review for Q2.",
          "score": 8
        }
      ],
      "overAllReview": "Two-line summary about candidate's overall performance."
    }

    Evaluate the following Q&A pairs:
    ${qaBlock}
    `;



  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "deepseek-r1:1.5b",
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.7
      }
    });

    const raw = response.data.response;
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Could not extract valid JSON from LLaMA output.");
    }

    const result = JSON.parse(match[0]);
    const { reviews, overAllReview } = result;

    const totalScore = reviews.reduce((sum, r) => sum + r.score, 0);

    return {
      reviews,
      totalScore,
      overAllReview
    };

  } catch (err) {
    console.error("Error calling LLaMA 3.2:", err.message);
    throw err;
  }
}
