


import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card.jsx";
import useConversation from '../stateManage/useConversation.js';
import { useAuth } from '../context/AuthProvider.jsx';
import EyeContactDetector from '../components/faceDetector.jsx';
import { ThemeContext } from "../context/ThemeContext";

function CandidateSection({ startInterview }) {
  const { candidateAnswer } = useConversation();
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const { authUser } = useAuth();
  const { theme } = React.useContext(ThemeContext);

  React.useEffect(() => {
    if (candidateAnswer.trim()) {
      setIsSpeaking(true);
      const timeout = setTimeout(() => setIsSpeaking(false), 500); 
      return () => clearTimeout(timeout);
    }
  }, [candidateAnswer]);

  return (
    <CardContainer className="inter-var">
      <CardBody className={`relative group/card shadow-2xl shadow-orange-500/30 ${theme === "dark" ? "bg-orange-100" : "bg-orange-50"} dark:border-orange-500/30 border-orange-200 sm:w-[30rem] rounded-xl p-6 border w-[400px] h-[400px] text-center`}>
        <CardItem translateZ="100" className="h-86 w-full">
          <CardItem translateZ="100" className="w-full h-full flex justify-center items-center">
            {startInterview ? (
              <div className="w-full h-full rounded-lg overflow-hidden">
                <EyeContactDetector />
              </div>
            ) : (
              <Avatar
                alt="Candidate"
                src={authUser?.user.profilePicURL}
                sx={{
                  width: 156,
                  height: 156,
                  border: '4px solid',
                  borderColor: '#ff6900',
                  transition: 'box-shadow 0.5s ease-in-out',
                  boxShadow: isSpeaking
                    ? '0px 0px 40px 12px rgba(255, 105, 0, 0.7)' 
                    : '0px 4px 20px rgba(255, 105, 0, 0.5)', 
                }}
              />
            )}
          </CardItem>
        </CardItem>
        <CardItem
          translateZ="50"
          className={`text-xl font-bold ${theme === "dark" ? "text-[#ff6900]" : "text-neutral-600"}`}
        >
          {authUser.user.name}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default CandidateSection;