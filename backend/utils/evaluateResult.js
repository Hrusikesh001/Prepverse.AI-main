import axios from 'axios';

export async function evaluateResult({ questions, answers }) {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Questions must be provided as a non-empty array.");
  }

  // Gracefully normalize answers: if answers is shorter, missing, or has nulls,
  // pad with 'Answer Not Provided.' so evaluation never fails.
  const normalizedAnswers = questions.map((_, i) => {
    const ans = answers && answers[i];
    return (ans && typeof ans === 'string' && ans.trim()) ? ans.trim() : "Answer Not Provided.";
  });

  const qaBlock = questions
    .map((q, i) => `Q${i + 1}: ${q.question || q}\nA${i + 1}: ${normalizedAnswers[i]}`)
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
      - Line 2: Mention the candidate's key strengths and weaknesses, based on the provided answers.

    Rules:
    - If an answer is missing, vague, or irrelevant (e.g. "Answer not provided" or "I will not answer this"), state that clearly and assign a score of **0**.
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
    // Using llama3.2 (same model as the rest of the app) instead of deepseek-r1.
    // deepseek-r1 outputs <think>...</think> reasoning chains before the JSON even
    // when format:"json" is set, which breaks JSON.parse reliably.
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2:latest",
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.5   // Slightly lower temp → more deterministic JSON output
      }
    }, { timeout: 300000 }); // 5-minute timeout for local LLM inference

    let raw = response.data.response;

    // Safety net: strip <think>...</think> blocks that reasoning models (deepseek-r1,
    // qwen3, etc.) insert before their JSON output — these break JSON.parse.
    raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    console.log("[evaluateResult] Raw LLM output (first 500 chars):", raw.substring(0, 500));

    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      console.error("[evaluateResult] Full raw output:", raw);
      throw new Error("Could not extract valid JSON from model output.");
    }

    let result;
    try {
      result = JSON.parse(match[0]);
    } catch (parseErr) {
      console.error("[evaluateResult] JSON.parse failed. Raw match:", match[0].substring(0, 500));
      throw new Error(`JSON parse error: ${parseErr.message}`);
    }

    const { reviews, overAllReview } = result;

    // Validate structure before computing score to avoid silent NaN
    if (!Array.isArray(reviews) || reviews.length === 0) {
      console.error("[evaluateResult] Invalid reviews structure:", reviews);
      throw new Error("Model returned invalid reviews structure.");
    }

    const totalScore = reviews.reduce((sum, r) => sum + (Number(r.score) || 0), 0);

    return {
      reviews,
      totalScore,
      overAllReview: overAllReview || "No overall review provided."
    };

  } catch (err) {
    console.error("[evaluateResult] Error:", err.message);
    throw err;
  }
}
