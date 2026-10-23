import axios from 'axios';
import InterviewData from '../models/interview.model.js';

export const generateQuestions = async (req, res) => {
  const { role, topic, name, previousQuestions = [], askedQuestion, numOfQns, modelId } = req.body;
  let { givenAnswer } = req.body;
  const { email } = req.user;

  if (!role || !topic || !name) {
    return res.status(500).json({ message: "Must provide a role, topic, and name!" });
  }

  if (!modelId) {
    return res.status(500).json({ message: "Must provide a modelId!" });
  }

  if (previousQuestions.length > 0 && (!askedQuestion || !givenAnswer)) {
    console.error('Missing fields for follow-up:', { askedQuestion, givenAnswer });
    return res.status(400).json({
      message: "For follow-up questions, must provide askedQuestion and givenAnswer!",
      received: { askedQuestion, givenAnswer }
    });
  }

  givenAnswer = givenAnswer?.trim() === "" ? "Answer Not Provided." : givenAnswer;

  try {
    let prompt;
    let aiResponse;
    let response;
    let finishInterview = false;

    if (previousQuestions.length === 0) {
      const prompt = `You are conducting a professional interview for a ${role} position, focusing on ${topic}.

      Your task is to generate:

      1. A warm, professional **welcome message** for the candidate **${name}**, written as **three short parts in a single line** (no line breaks or \\n).
        - The entire message must be **under 200 words**.
        - Structure it as three logically separated parts (e.g., greeting + purpose + encouragement), but keep it in one continuous line.
        - Mention the job title clearly and naturally (e.g., “as a frontend developer” instead of “for this role”).
        - Use a professional but friendly tone.
        - Do **not** mention AI, mock interviews, or simulations.
        - Avoid line breaks, bullet points, and numbered lists.

      2. A **standalone transition phrase** to smoothly begin the first question.
        - It must be a **phrase or sentence fragment**, not a complete sentence or question.
        - It must **not** include any background, resume hints, or job-related content.
        - It must be **professional and slightly varied**, like “Let’s begin with” or “To get things started,”.
        - It must **not** contain a question mark.

      Return STRICT JSON only in this format:
      {
        "addressing": "single-line welcome message",
        "transition": "transition phrase"
      }`;




      aiResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2:latest",
          prompt: prompt,
          stream: false,
          format: "json",
          options: {
            temperature: 0.7
          }
        }
      );

      const rawdata = aiResponse.data.response;

      const jsonMatch = rawdata.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
      if (!jsonMatch) {
        return res.status(500).json({ message: "Invalid JSON received from AI!" });
      }
      response = JSON.parse(jsonMatch[0]);

      const { addressing, transition } = response;

      if (!addressing || !transition) {
        return res.status(500).json({ message: "Failed to generate question!" });
      }

      const data = await InterviewData.findById(modelId);
      const question = data.questions[0];

      let transitionData = transition.trim();
      if (transitionData.endsWith(".")) {
        transitionData = transitionData.slice(0, -1) + ",";
      } else if (!transitionData.endsWith(",")) {
        transitionData += ",";
      }

      let responseData = addressing + " " + transitionData + " " + question.question;

      return res.status(200).json({ message: "Question generated!", question, responseData, finishInterview });

    } else {

      if (previousQuestions.length == numOfQns) {

        prompt = `You are conducting a professional interview for ${role} focusing on ${topic}.

        Previous Question: "${askedQuestion}"
        Candidate Answer: "${(givenAnswer || '').trim() || '[No answer provided]'}"

        Generate:

        1. FEEDBACK (STRICT RULES):
          - Exactly 2 professional sentences
          - Use "you/your" to address the candidate directly
          - Only assess the answer — no suggestions, tips, or ratings
          - The tone must be objective and professional — avoid encouraging or consoling language
          - Only assess the answer — do not offer suggestions, praise, tips, or requests to try again
          - If the answer is incorrect, missing, or incomplete, state that directly and factually
          - Do not ask the candidate to answer the question again while giving feedback
          - If no answer was given, indicate that clearly and professionally
          - Example (if no answer): "You did not provide a response to the question. This may reflect a gap in your understanding of the topic."
          - Example: (normal): "Your explanation covered X well. You might clarify Y."


        2. END MESSAGE (STRICT RULES):
          - Generate a professional, warm, and slightly longer thank-you message (2–3 sentences)
          - Express appreciation for the candidate’s time, effort, and responses
          - Each time, use **different wording** — avoid repeating any previously used thank-you messages
          - Match the tone of this example, but do not copy it:  
            "Thank you for participating in this interview. Your insights were valuable and demonstrated thoughtful engagement. We appreciate the time and effort you invested."

        Return STRICT JSON:
        {
          "feedback": "your 2-sentence feedback",
          "transition": "a 2–3 sentence thank-you message to end the interview"
        }
        ONLY return this JSON with no other text.`;

        finishInterview = true;

      } else {

        prompt = `You are conducting a professional interview for ${role} focusing on ${topic}.

        Previous Question: "${askedQuestion}"
        Candidate Answer: "${(givenAnswer || '').trim() || '[No answer provided]'}"

        Generate:

        1. FEEDBACK (STRICT RULES):
          - Exactly 2 professional sentences
          - Use "you/your" to address the candidate directly
          - Only assess the answer — no suggestions, tips, or ratings
          - The tone must be objective and professional — avoid encouraging or consoling language
          - Only assess the answer — do not offer suggestions, praise, tips, or requests to try again
          - If the answer is incorrect, missing, or incomplete, state that directly and factually
          - Do not ask the candidate to answer the question again while giving feedback
          - If no answer was given, indicate that clearly and professionally
          - Example (if no answer): "You did not provide a response to the question. This may reflect a gap in your understanding of the topic."
          - Example: (normal): "Your explanation covered X well. You might clarify Y."

        2. TRANSITION (STRICT RULES):
          - Use one of these openings:
            "Next, let's discuss,", "Moving on to,", "Now, consider,"
          - Do NOT include a question — just a natural lead-in to a new topic
          - End with a colon or ellipsis, not a full sentence or question

        Return STRICT JSON:
        {
          "feedback": "your 2-sentence feedback",
          "transition": "transition phrase only (no question)"
        }
        ONLY return this JSON with no other text.`;
      }



      aiResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2:latest",
          prompt: prompt,
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
      response = JSON.parse(jsonMatch[0]);
      const { feedback, transition } = response;

      const data = await InterviewData.findById(modelId);
      const question = data.questions[previousQuestions.length];

      let transitionData = transition.trim();


      if (!question) {
        if (transitionData.endsWith(",")) {
          transitionData = transitionData.slice(0, -1) + ".";
        } else if (!transitionData.endsWith(".")) {
          transitionData += ".";
        }
      } else {
        if (transitionData.endsWith(".")) {
          transitionData = transitionData.slice(0, -1) + ",";
        } else if (!transitionData.endsWith(",")) {
          transitionData += ",";
        }
      }

      data.answers[previousQuestions.length - 1] = givenAnswer;
      await data.save();

      let responseData = "";

      if (!question) {
        responseData = feedback + " " + transitionData;
      } else {
        responseData = feedback + " " + transitionData + " " + question.question;
      }

      return res.status(200).json({ message: "Question generated!", question, responseData, finishInterview });
    }

  } catch (err) {
    console.error("Error in generateQuestions:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const checkRoleAndTopic = async (req, res) => {

  const { role, topic, numOfQns } = req.body;
  const participant = req.user._id;

  if (!role || !topic || !numOfQns) {
    return res.status(500).json({ message: "Provide valid inputs" });
  }

  if (numOfQns < 2 || numOfQns > 25) {
    return res.status(400).json({ message: "Please provide a number of questions between 1 and 25." });
  }

  try {
    const prompt = `
    You are an expert AI interview assistant.

    Your task:
    - Validate whether the given role and topic are appropriate and related.
    - If valid, generate an array of unique, concise, and orally answerable interview questions relevant to the role and topic.

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

    If valid:
    {
      "valid": true,
      "questions": [
        { "question": "First unique question?", "time": 30 },
        { "question": "Second unique question?", "time": 50 }
        // ...${numOfQns} total
      ]
    }

    If invalid (role and topic do not match or are inappropriate):
    {
      "valid": false,
      "questions": []
    }

    Now process this input:
    Role: ${role}
    Topic: ${topic}

    Only respond with the JSON object as described above. Do not include any explanations.`;


    const aiResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2:latest",
        prompt: prompt,
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

    let { valid, questions } = response;



    if (valid) {
      try {

        questions = questions.slice(0, numOfQns);

        const newData = new InterviewData({
          participant,
          questions,
          answers: questions.map(() => "Answer Not Provided.")
        });

        await newData.save();

        const interviewModelId = newData._id;

        return res.status(200).json({ message: "Questions generated", response, interviewModelId });

      } catch (err) {
        console.log(err);
      }
    }


    return res.status(200).json({ message: "Questions generated", response });


  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
}






















