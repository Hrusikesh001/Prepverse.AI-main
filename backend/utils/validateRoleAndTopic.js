import axios from 'axios';

export const validateSingleTopic  = async ({ role, topic }) => {
  const prompt = `
You are an expert AI assistant.

Your task is to determine whether the given role and the following comma-separated list of topics are appropriate and logically related.

Return strictly one of the following JSON responses:

If the combination is valid:
{ "valid": true }

If the combination is inappropriate or unrelated:
{ "valid": false }

Do not provide any explanation or extra text.

Role: ${role}
Topics: ${topic}
`;

  try {
    const aiResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2:latest",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.3
        }
      }
    );

    let raw = aiResponse.data.response;
    if (!raw.endsWith("}")) raw += "}";

    const jsonMatch = raw.match(/\{\s*"valid"\s*:\s*(true|false)\s*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.log("validateSingleTopic AI error (falling back to valid):", err.message);
    return { valid: true }; // Fallback to valid if Ollama fails
  }
};

export const validateRoleAndTopic = async ({ role, topics }) => {
  try {
    for (const topic of topics) {
      const result = await validateSingleTopic({ role, topic });
      if (result && !result.valid) {
        return { valid: false };
      }
    }
    return { valid: true };
  } catch (err) {
    console.log("Validation threw an error, defaulting to valid:", err.message);
    return { valid: true }; // Fallback to valid if anything else fails
  }
};