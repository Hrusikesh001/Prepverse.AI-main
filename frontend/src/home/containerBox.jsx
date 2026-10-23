import React from "react";
import { MovingBorderDiv } from "../components/ui/moving-border.jsx";
import { 
  Security, 
  Groups, 
  EmojiEvents,
  Verified,
  Diversity3,
  School,
  WorkspacePremium,
  CorporateFare
} from "@mui/icons-material";

const TrustContainer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-6 lg:p-12 bg-black/50 backdrop-blur-sm">
      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-400 to-blue-700 text-white">
        <Security fontSize="large" />
        <h3 className="text-xl font-bold">Enterprise-Grade Security</h3>
        <p className="text-sm font-medium text-white/90">
          We're SOC 2 Type II certified with end-to-end encryption. Your data never leaves our secured infrastructure.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <Verified fontSize="small" className="mr-1" />
          <span>Trusted by Fortune 500 companies</span>
        </div>
      </MovingBorderDiv>

      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-green-400 to-emerald-600 text-white">
        <Groups fontSize="large" />
        <h3 className="text-xl font-bold">AI Experts With Proven Track Record</h3>
        <p className="text-sm font-medium text-white/90">
          Founded by Stanford AI researchers and industry veterans with 50+ years combined experience in HR technology.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <WorkspacePremium fontSize="small" className="mr-1" />
          <span>15 patents in conversational AI</span>
        </div>
      </MovingBorderDiv>

     
      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-purple-500 to-indigo-700 text-white">
        <EmojiEvents fontSize="large" />
        <h3 className="text-xl font-bold">Industry Recognition</h3>
        <p className="text-sm font-medium text-white/90">
          Winner of 2023 AI Breakthrough Award and featured in Forbes AI 50 list of most promising companies.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <CorporateFare fontSize="small" className="mr-1" />
          <span>Partnered with LinkedIn and Glassdoor</span>
        </div>
      </MovingBorderDiv>

      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-orange-400 to-rose-600 text-white">
        <Diversity3 fontSize="large" />
        <h3 className="text-xl font-bold">Commitment to Fairness</h3>
        <p className="text-sm font-medium text-white/90">
          Our algorithms are audited biannually for bias, helping eliminate discrimination in hiring processes.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <School fontSize="small" className="mr-1" />
          <span>Used by 300+ universities worldwide</span>
        </div>
      </MovingBorderDiv>
    </div>
  );
};

export default TrustContainer;