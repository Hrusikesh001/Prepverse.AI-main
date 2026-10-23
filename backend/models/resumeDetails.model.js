import mongoose from "mongoose";
import { Schema } from "mongoose";

const resumeContentSchema = new Schema({
  title: { type: String, default: "" },
  thumbnailLink: { type: String, default: "" },
  profileInfo: {
    profilePreviewUrl: { type: String, default: "" },
    profilePublicId: { type: String, default: "" },
    fullName: { type: String, default: "" },
    designation: { type: String, default: "" },
    summary: { type: String, default: "" },
  },
  template: {
    number: {
      type: Number,
      default: 0
    },
  },
  contactInfo: {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  workExperience: [{
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
  }],
  education: [{
    degree: { type: String, default: "" },
    institution: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  }],
  skills: [{
    name: { type: String, default: "" },
    progress: { type: Number, default: 0 },
  }],
  projects: [{
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    github: { type: String, default: "" },
    liveDemo: { type: String, default: "" },
  }],
  certifications: [{
    title: { type: String, default: "" },
    issuer: { type: String, default: "" },
    year: { type: String, default: "" },
  }],
  languages: [{
    name: { type: String, default: "" },
    progress: { type: Number, default: 0 },
  }],
  interest: [{
    name: { type: String, default: "" },
  }]
}, { _id: false });


const resumeDetailsSchema = new Schema({
  resumeDetails: resumeContentSchema,
}, { timestamps: true });

const ResumeDetails = mongoose.model("ResumeDetails", resumeDetailsSchema);

export default ResumeDetails
