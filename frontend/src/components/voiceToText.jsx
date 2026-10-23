import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceConvertor = ({ onTranscriptUpdate, onControlsReady }) => {
  const [isClient, setIsClient] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (onTranscriptUpdate) {
      onTranscriptUpdate(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (onControlsReady) {
      onControlsReady({
        startListening: () => SpeechRecognition.startListening({ continuous: true }),
        stopListening: () => SpeechRecognition.stopListening(),
        resetTranscript,
        isListening: listening,
      });
    }
  }, [listening, resetTranscript]);

  if (!isClient) return null;

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return null;
};

export default VoiceConvertor;