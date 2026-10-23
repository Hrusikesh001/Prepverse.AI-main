import {create} from 'zustand'

const useConversation = create((set) => ({
  candidateAnswer: "",
  setCandidateAnswer: (candidateAnswer) => set({candidateAnswer}),

  assistantContent: "",
  setAssistantContent: (assistantContent) => set({assistantContent}),

  askedQuestions: [],
  setAskedQuestions: (askedQuestions) => set({askedQuestions}),

  givenAnswers: [],
  setGivenAnswers: (givenAnswers) => set({givenAnswers}),

  accessInterviewPage: false,
  setAccessInterviewPage: (accessInterviewPage) => set({accessInterviewPage}), 

  interviewData: {
    topic: "",
    role: "",
    numOfQns: 0,
  },
  setInterviewData: (interviewData) => set({ interviewData }),

  quizData : [],
  setQuizData : (quizData) => set({quizData}),

  interviewModelId : '',
  setInterviewModelId: (interviewModelId) => set({interviewModelId}),

  reportData: [],
  setReportData: (data) => set({ reportData: data }),

  distractionDetect : false,
  setDistractionDetect: (distractionDetect) => set({distractionDetect}),
}));

export default useConversation;

























