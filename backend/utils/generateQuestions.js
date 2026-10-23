import axios from 'axios';

export const generateQuestions = async ({ role, topic, numOfQns }) => {
      const prompt = `
You are an expert AI interview assistant.

Your task:
- Generate an array of unique, concise, and orally answerable interview questions relevant to the given role and topic.

Constraints:
1. Generate exactly ${numOfQns} unique and non-repetitive interview questions.
2. Each question must be clear, focused, and easily answerable within a 30–60 second spoken response.
3. All questions must be different in wording and focus — avoid redundancy.
4. Avoid overly technical or essay-style questions unless essential to the role.
5. For each question, estimate the expected time (in seconds) a candidate would take to answer it orally. Use the following scale:
    - Simple factual questions: 30–35 seconds.
    - Conceptual or reasoning-based questions: 40–50 seconds.
    - Scenario-based, open-ended, or multi-step questions: 50–60 seconds.
  Ensure a natural variation across the question list, based on complexity.

Return your response strictly in the following JSON format:

{
  "questions": [
    { "question": "First unique question?", "time": 30 },
    { "question": "Second unique question?", "time": 50 }
    // ...${numOfQns} total
  ]
}

Now process this input:
Role: ${role}
Topic: ${topic}

Only respond with the JSON object as described above. Do not include any explanations.`;



  try {
    const aiResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2:latest",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.7
        }
      }
    );

    let rawdata = aiResponse.data.response;

    if (!rawdata.endsWith("}")) {
      rawdata += "}";
    }

    const jsonMatch = rawdata.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "Invalid JSON received from AI!" });
    }
    const response = JSON.parse(jsonMatch[0]);

    let { questions } = response;

    questions = questions.map((q) => ({
      question: q.question,
      time: q.time || 50
    }));

    return questions;

  } catch (error) {
    console.error("Error in generateQuestions:", error.message);
    throw new Error("AI processing failed.");
  }
};
