import mongoose from "mongoose";
import { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    questions: {
      type: [
        {
          question : {type : String, required: true},
          options : {
            type : [String],
            required : true,
          },
          answer : {type : String, required : true}
        }
      ],
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const QuizData = mongoose.model("QuizData", quizSchema);

export default QuizData;






















