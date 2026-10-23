

import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import useConversation from "../stateManage/useConversation";
import { toast } from 'react-hot-toast'

export default function EyeContactDetector() {
  const videoRef = useRef(null);
  const faceMeshRef = useRef(null);
  const lastWarningTimeRef = useRef(Date.now());
  const cameraRef = useRef(null);
  const { setDistractionDetect } = useConversation();

  const [isLooking, setIsLooking] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [interviewEnded, setInterviewEnded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMeshRef.current = faceMesh;

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (interviewEnded) return;

      const landmarks = results.multiFaceLandmarks?.[0];
      const now = Date.now();

      if (!landmarks) {
        setIsLooking(false);
        if (now - lastWarningTimeRef.current > 2000) {
          lastWarningTimeRef.current = now;
          setWarningCount((prev) => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setInterviewEnded(true);
            }
            return newCount;
          });
        }
        return;
      }

      const leftEye = landmarks[33];
      const rightEye = landmarks[263];
      const noseTip = landmarks[1];
      const forehead = landmarks[10];
      const chin = landmarks[152];

      const faceWidth = Math.abs(rightEye.x - leftEye.x);
      const faceHeight = Math.abs(forehead.y - chin.y);

      const eyeCenterX = (leftEye.x + rightEye.x) / 2;
      const xDeviation = Math.abs(noseTip.x - eyeCenterX) / faceWidth;

      const verticalCenterY = (forehead.y + chin.y) / 2;
      const yDeviation = Math.abs(noseTip.y - verticalCenterY) / faceHeight;

      const xThreshold = 0.15;
      const yThreshold = 0.15;

      const lookingNow = xDeviation < xThreshold && yDeviation < yThreshold;
      setIsLooking(lookingNow);

      if (!lookingNow && now - lastWarningTimeRef.current > 2000) {
        lastWarningTimeRef.current = now;
        setWarningCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setInterviewEnded(true);
            setDistractionDetect(true);
          }
          return newCount;
        });
      }
    });

    const camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        if (
          videoRef.current &&
          videoRef.current.readyState >= 2 &&
          faceMeshRef.current &&
          !interviewEnded
        ) {
          try {
            await faceMeshRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error("FaceMesh send() error:", err);
          }
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;
    camera.start();

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
    };
  }, [interviewEnded]);

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />

        {!interviewEnded ? (
          <>
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium shadow-md ${isLooking ? "bg-gray-600" : "bg-[#ff6900]"
                } text-white`}
            >
              {isLooking ? "Looking" : "Not Looking"}
            </div>

            <div className="absolute top-2 left-2 px-2 py-1 bg-[#ff6900] text-white rounded-full text-xs font-medium shadow-md">
              Warnings: {warningCount} / 5
            </div>

            {!isLooking && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#ff6900] text-white px-3 py-1 rounded text-xs font-semibold animate-pulse">
                Please look at the screen
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-center px-4">
            <p className="text-lg font-bold">
              Interview ended due to too many distractions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}