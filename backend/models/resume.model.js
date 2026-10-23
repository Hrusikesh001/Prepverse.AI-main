import mongoose from "mongoose";
import { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    resumes : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ResumeDetails',
        required : true
      }
    ]
    
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;






















