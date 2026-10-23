

import React, { useContext } from 'react';
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card.jsx";
import Lottie from 'lottie-react';
import animation from '../assets/animations/aiAssistant.json';
import { ThemeContext } from "../context/ThemeContext";

function AssistantPage() {
  const { theme } = useContext(ThemeContext);

  return (
    <CardContainer className="inter-var">
      <CardBody className={`relative group/card shadow-2xl shadow-[#ff6900]/30 ${theme === "dark" ? "bg-orange-100" : "bg-orange-50"} dark:border-[#ff6900]/30 border-[#ff6900] sm:w-[30rem] rounded-xl p-6 border w-[400px] h-[400px] text-center`}>
        <CardItem translateZ="100" className="w-full h-86">
          <Lottie 
            animationData={animation} 
            loop={true}
            className="h-76 w-full object-cover rounded-xl group-hover/card:shadow-xl"
          />
        </CardItem>
        <CardItem
          translateZ="50"
          className={`text-xl font-bold ${theme === "dark" ? "text-[#ff6900]" : "text-neutral-600"}`}
        >
          AI Interviewer
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default AssistantPage;

