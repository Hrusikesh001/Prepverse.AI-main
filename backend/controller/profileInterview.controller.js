
import axios from 'axios';
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js';
import fs from 'fs';
import FormData from 'form-data';
import { deleteFile } from '../utils/deleteFile.js';
import { generateInterviewQuestions } from '../utils/generateProfileInterviewQuestions.js';
import InterviewData from '../models/interview.model.js';
import { io, getUserSocketId } from '../SocketIO/server.js';
import ResumeData from '../models/resumeData.model.js';

const FLASK_URL = 'http://127.0.0.1:3000';

const normalizeTopics = (topics) => {
  if (typeof topics === 'string') {
    return topics
      .split(',')
      .map(topic => topic.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(topics)) {
    return [];
  }

  return topics.filter(
    topic => typeof topic === 'string' && topic.trim() !== ''
  );
};

const evaluateResume = async ({ resumeData, role, topics }) => {
  console.log('\n========== RESUME EVALUATION DEBUG ==========');
  console.log('Job title:', role);
  console.log('Topics:', JSON.stringify(topics));
  console.log(
    'Resume data type:',
    Array.isArray(resumeData) ? 'array' : typeof resumeData
  );

  if (resumeData && typeof resumeData === 'object') {
    console.log('Resume data keys:', Object.keys(resumeData));
    console.log(
      'Resume sections:',
      JSON.stringify(
        Object.fromEntries(
          Object.entries(resumeData).map(([key, value]) => [
            key,
            Array.isArray(value)
              ? `array (${value.length} items)`
              : typeof value
          ])
        ),
        null,
        2
      )
    );
  }

  console.log('=============================================\n');

  const { data } = await axios.post(
    `${FLASK_URL}/evaluate-resume`,
    {
      resume_data: resumeData,
      job_title: role,
      topics
    }
  );

  const evaluation = data?.evaluation;

  if (
    !evaluation ||
    typeof evaluation.total_score !== 'number' ||
    typeof evaluation.summary_feedback !== 'string'
  ) {
    throw new Error('Flask returned an invalid resume evaluation.');
  }

  return {
    totalScore: evaluation.total_score,
    summaryFeedback: evaluation.summary_feedback
  };
};

const validateInput = ({ role, topics, numberOfQns }) => {
  return (
    typeof role === 'string' &&
    role.trim() !== '' &&
    topics.length > 0 &&
    Boolean(numberOfQns) &&
    Number.isFinite(Number(numberOfQns)) &&
    Number(numberOfQns) > 0
  );
};

export const checkRoleValidity = async (req, res) => {
  const { role, numberOfQns } = req.body;
  const topics = normalizeTopics(req.body.topics);
  const participant = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'No file provided.' });
  }

  const filePath = req.file.path;

  const cleanupFile = () => {
    try {
      deleteFile(filePath);
    } catch (error) {
      console.error('Temporary file cleanup failed:', error);
    }
  };

  if (!validateInput({ role, topics, numberOfQns })) {
    cleanupFile();
    return res.status(400).json({
      message: 'Provide a valid role, topics, and number of questions.'
    });
  }

  const userSocketId = getUserSocketId(participant);

  if (!userSocketId) {
    cleanupFile();
    return res.status(400).json({ message: 'User Socket ID not found.' });
  }

  try {
    const { valid } = await validateRoleAndTopic({ role, topics });

    io.to(userSocketId).emit('validateRoleAndTopic', { valid });

    if (!valid) {
      return res.status(422).json({
        message: 'The provided role and topics are not valid.'
      });
    }

    const form = new FormData();
    form.append(
      'file',
      fs.createReadStream(filePath),
      req.file.originalname
    );

    const { data } = await axios.post(
      `${FLASK_URL}/parse-resume`,
      form,
      { headers: form.getHeaders() }
    );

    const resumeData = data?.resume_data;

    if (!resumeData || typeof resumeData !== 'object') {
      return res.status(422).json({
        message: 'Resume parsing did not return valid resume data.'
      });
    }

    io.to(userSocketId).emit('resumeParsed');

    const evaluation = await evaluateResume({
      resumeData,
      role,
      topics
    });

    io.to(userSocketId).emit('resumeScore', evaluation);

    if (evaluation.totalScore < 30) {
      return res.status(422).json({
        message: 'Your resume may not demonstrate enough relevant topic coverage.',
        ...evaluation
      });
    }

    const questions = await generateInterviewQuestions(
      resumeData,
      role,
      topics,
      parseInt(numberOfQns, 10) || 5
    );

    if (!questions || !questions.length) {
      return res.status(500).json({
        message: 'Failed to generate interview questions.'
      });
    }

    const newData = new InterviewData({
      participant,
      questions,
      answers: questions.map(() => 'Answer Not Provided.')
    });

    await newData.save();

    io.to(userSocketId).emit('questionsGenerated');

    return res.status(200).json({
      message: 'Process successful.',
      interviewModelId: newData._id
    });
  } catch (err) {
    console.error('checkRoleValidity error:', err.response?.data || err);
    return res.status(500).json({
      message: 'Server error while validating the resume.'
    });
  } finally {
    cleanupFile();
  }
};

export const profileBasedInterview = async (req, res) => {
  const { role, numberOfQns, interviewId } = req.body;
  const topics = normalizeTopics(req.body.topics);
  const participant = req.user._id;

  if (
    !validateInput({ role, topics, numberOfQns }) ||
    !interviewId
  ) {
    return res.status(400).json({
      message: 'Provide a valid role, topics, number of questions, and interview ID.'
    });
  }

  const userSocketId = getUserSocketId(participant);

  if (!userSocketId) {
    return res.status(400).json({
      message: 'User Socket ID not found.'
    });
  }

  try {
    const existing = await InterviewData.findOne({
      interviewId,
      participant
    });

    if (existing) {
      return res.status(409).json({
        message: 'Already attended the interview.'
      });
    }

    const { valid } = await validateRoleAndTopic({ role, topics });

    io.to(userSocketId).emit('validateRoleAndTopic', { valid });

    if (!valid) {
      return res.status(422).json({
        message: 'The provided role and topics are not valid.'
      });
    }

    const resumeRecord = await ResumeData.findOne({
      userId: participant
    });

    if (!resumeRecord?.resumeJSONdata) {
      return res.status(404).json({
        message: 'Resume data not found. Please upload or parse your resume first.'
      });
    }

    const resumeData = resumeRecord.resumeJSONdata;

    io.to(userSocketId).emit('resumeParsed');

    const evaluation = await evaluateResume({
      resumeData,
      role,
      topics
    });

    io.to(userSocketId).emit('resumeScore', evaluation);

    if (evaluation.totalScore < 30) {
      return res.status(422).json({
        message: 'Your resume may not demonstrate enough relevant topic coverage.',
        ...evaluation
      });
    }

    const questions = await generateInterviewQuestions(
      resumeData,
      role,
      topics,
      parseInt(numberOfQns, 10) || 5
    );

    if (!questions || !questions.length) {
      return res.status(500).json({
        message: 'Failed to generate interview questions.'
      });
    }

    const newData = new InterviewData({
      interviewId,
      participant,
      questions,
      answers: questions.map(() => 'Answer Not Provided.')
    });

    await newData.save();

    io.to(userSocketId).emit('questionsGenerated');

    return res.status(200).json({
      message: 'Process successful.',
      interviewModelId: newData._id
    });
  } catch (err) {
    console.error(
      'profileBasedInterview error:',
      err.response?.data || err
    );

    return res.status(500).json({
      message: 'Server error while processing the interview.'
    });
  }
};
