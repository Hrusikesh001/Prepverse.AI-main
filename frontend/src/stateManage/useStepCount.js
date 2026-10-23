import { create } from 'zustand';

const useStepCount = create((set) => ({
  currentStep: 0,
  setCurrentStep: (currentStep) => set({currentStep}),

  resumeAnalysis: {
    atsScore: 0,
    overallReview: "Data not generated."
  },
  setResumeAnalysis: (resumeAnalysis) => set({resumeAnalysis}),

  showInstructions: false,
  setShowInstructions: (showInstructions) => set({showInstructions}),

  showAnalysis: false,
  setShowAnalysis: (showAnalysis) => set({showAnalysis}),

}))

export default useStepCount;






























