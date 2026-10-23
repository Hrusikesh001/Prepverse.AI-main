import mongoose from "mongoose";
import { Schema } from "mongoose";

const companyInterviewSchema = new Schema(
  {
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true
    },
    interview: {
      role: {
        type: String,
        required: true,
      },
      numOfQns: {
        type: Number,
        required: true,
      },
      topics : [
        {
          type : String,
          required : true
        }
      ]
    }
    ,
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  {
    timestamps: true,
  }
);

const CompanyInterviewData = mongoose.model("CompanyInterviewData", companyInterviewSchema);

export default CompanyInterviewData;






















