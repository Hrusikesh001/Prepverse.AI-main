import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function CheckCameraAndMic({ onContinue }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [micAccessible, setMicAccessible] = useState(false);
  const [camWorking, setCamWorking] = useState(false);
  const [checking, setChecking] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const checkPermissionsAndDevices = async () => {
    setChecking(true);
    setPermissionError(false);
    setMicAccessible(false);
    setCamWorking(false);
    stopStream();

    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      const preferredCam =
        videoDevices.find((device) =>
          /built-in|integrated|internal/i.test(device.label)
        ) || videoDevices[0];

      const constraints = {
        video: preferredCam
          ? { deviceId: { exact: preferredCam.deviceId } }
          : true,
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCamWorking(true);
        };
      }

      const hasAudioTrack = stream.getAudioTracks().length > 0;
      setMicAccessible(hasAudioTrack);

      setChecking(false);
    } catch (err) {
      console.error("Permission denied or media error:", err);
      setPermissionError(true);
      setChecking(false);
    }
  };

  useEffect(() => {
    checkPermissionsAndDevices();
    return () => {
      stopStream();
    };
  }, []);

  const handleContinue = () => {
    if (micAccessible && camWorking) {
      stopStream();
      onContinue?.();
    }
  };

  // Tailwind classes based on theme
  const bgColor = darkMode ? "bg-black" : "bg-gray-100";
  const textColor = darkMode ? "text-[#ff6900]" : "text-[#ff6900]";
  const cardBg = darkMode ? "bg-orange-100" : "bg-orange-50";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const cardCircleBg = darkMode ? "bg-gray-700/20" : "bg-[#ff6900]/20";
  const errorBg = darkMode ? "bg-red-900/30" : "bg-red-50";
  const errorText = darkMode ? "text-red-200" : "text-red-700";

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center px-6 py-12 w-full transition-colors duration-300`}
    >
      <div className="max-w-4xl w-full space-y-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{`Device Check`}</h1>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Please allow access to your camera and microphone to continue to the
            interview. We need to verify your devices are working properly
            before starting.
          </p>
        </div>

        {/* Device Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
          {/* Camera */}
          <div
            className={`${cardBg} rounded-2xl p-6 flex-1 flex flex-col items-center shadow-lg border ${borderColor}`}
          >
            <div
              className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full ${cardCircleBg}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#ff6900]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Camera</h3>
            <div
              className="w-full h-48 rounded-xl overflow-hidden border-2 mb-4"
              style={{ borderColor: camWorking ? "#ff6900" : "#ef4444" }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>
            <div className="flex items-center mt-2">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  camWorking ? "animate-pulse" : ""
                }`}
                style={{ backgroundColor: camWorking ? "#ff6900" : "#ef4444" }}
              />
              <p className="font-medium">
                {camWorking
                  ? "Camera is working properly"
                  : "Camera not detected"}
              </p>
            </div>
          </div>

          {/* Microphone */}
          <div
            className={`${cardBg} rounded-2xl p-6 flex-1 flex flex-col items-center shadow-lg border ${borderColor}`}
          >
            <div
              className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full ${cardCircleBg}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#ff6900]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Microphone</h3>
            <div
              className="w-full h-48 rounded-xl flex items-center justify-center mb-4 border-2"
              style={{ borderColor: micAccessible ? "#ff6900" : "#ef4444" }}
            >
              <div className="text-6xl">{micAccessible ? "🎤" : "🚫"}</div>
            </div>
            <div className="flex items-center mt-2">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  micAccessible ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: micAccessible ? "#ff6900" : "#ef4444",
                }}
              />
              <p className="font-medium">
                {micAccessible
                  ? "Microphone is accessible"
                  : "Microphone not detected"}
              </p>
            </div>
          </div>
        </div>

        {/* Checking / Error */}
        {checking ? (
          <div className="text-center mt-8">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full ${cardCircleBg}`}
            >
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3"
                style={{ borderColor: "#ff6900" }}
              />
              <span>#ff6900</span>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center">
            {permissionError && (
              <div
                className={`p-6 rounded-2xl shadow-md mb-6 text-left max-w-2xl mx-auto ${errorBg}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-3 mt-0.5"
                      style={{ color: "#ef4444" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-lg mb-1"
                      style={{ color: "#ef4444" }}
                    >
                      Permission Required
                    </h3>
                    <p className={errorText}>
                      Permission denied or devices not accessible. Please allow
                      camera and microphone access in your browser settings to
                      continue.
                    </p>
                    <button
                      onClick={checkPermissionsAndDevices}
                      className={`mt-4 px-5 py-2.5 rounded-lg transition font-medium flex items-center bg-[#ff6900] text-white`}
                    >
                      Retry Device Check
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!(micAccessible && camWorking)}
              className={`px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
                !(micAccessible && camWorking)
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
              style={{
                backgroundColor: "#ff6900",
                boxShadow:
                  micAccessible && camWorking
                    ? "0 4px 14px 0 #ff690060"
                    : "none",
              }}
            >
              {micAccessible && camWorking
                ? "Continue to Interview "
                : "Enable Devices to Continue "}
            </button>

            {!(micAccessible && camWorking) && !permissionError && (
              <p
                className={`mt-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Both camera and microphone need to be enabled to continue
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
