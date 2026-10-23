import express from 'express'

import dotenv from 'dotenv'
dotenv.config();

import cors from 'cors'
import axios from 'axios'
import interviewSection from './route/interview.route.js'

import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';
import userRoute from './route/user.route.js'
import secureRoute from './middleware/secureRoute.js'
import quizRoute from './route/quiz.route.js'
import resumeRoute from './route/resume.route.js'
import profileInterviewRoute from './route/profileInterview.route.js'
import {app, io, server} from './SocketIO/server.js'
import resumeUploadRoute from './route/resumeUpload.route.js'
import internshipRoute from './route/internships.route.js'


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI;


const allowedOrigins = ['http://localhost:5173', 'https://prepverse-ai-python-server.onrender.com', 'https://prepverse-ai.onrender.com', 'http://127.0.0.1:3000', ' http://127.0.0.1:5000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const main = async () => {
  await mongoose.connect(MONGO_URI).then((data) => {
    console.log("Database is Connected");
  }).catch((err) => {
    console.log("Database Error : ", err);
  });
}

main();

app.use('/user', userRoute);
app.use('/interview', interviewSection);
app.use('/quiz', quizRoute);
app.use('/resume', resumeRoute);
app.use('/profileInterview', profileInterviewRoute);
app.use('/resume-upload', resumeUploadRoute);
app.use('/internships', internshipRoute);

app.get('/verify-token', secureRoute, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    user: req.user, 
  });
});

app.get("/getImage", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  });
});

app.post('/deleteImage', async (req, res) => {
  const { publicId } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    res.status(200).json({result});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





server.listen(port, () => {
  console.log("app is running at port 8000");
});























