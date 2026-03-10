import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * Full implementation fixing "Box.constructor" error and 
 * aligning with Admin Schema/Auth routes.
 */
const FaceEnroll = ({ faceEnrollActive, setFaceEnrollActive, mode = "signup" }) => {
 
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading AI Models...");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Models must be in public/models folder
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
        if (faceEnrollActive) {
          startVideo();
        }
      } catch (err) {
        setStatus("Error loading models. Check public/models location.");
      }
    };
    loadModels();
  }, [faceEnrollActive]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => { 
        if (videoRef.current) videoRef.current.srcObject = stream; 
      })
      .catch(() => setStatus("Camera access denied"));
    setStatus(mode === "signup" ? "Position face to Log Admin" : "Position face to Login");
  };

  const handleEnroll = async () => {
    if (isScanning) return; 
    setIsScanning(true);
    setStatus("Scanning... extracting biometric features");

    const runDetection = async () => {
      try {
        // High inputSize helps avoid detection skips
        const detection = await faceapi.detectSingleFace(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.4 })
        ).withFaceLandmarks().withFaceDescriptor();

        /**
         * THE FIX FOR "Box.constructor" ERROR:
         * We verify 'detection.detection' exists. If face-api returns a 
         * malformed box, this skips the frame instead of crashing.
         */
        if (!detection || !detection.detection || !detection.detection.box) {
          requestAnimationFrame(runDetection);
          return;
        }

        // Convert the Float32Array to a standard JS Array for the Backend
        const descriptorArray = Array.from(detection.descriptor);
        
        // Use the Admin Routes we established
        const endpoint = mode === "login" ? `${BASE_URL}/api/admin/signup` : `${BASE_URL}/api/admin/login`;

        const response = await axios.post(`${endpoint}`, { 
          username: "admin", // Matches your Admin Schema
          descriptor: descriptorArray 
        }, { withCredentials: true });

        setStatus(response.data.message || "Success!");
        setIsScanning(false);

        // Redirect or close modal on success
        if (response.data.authenticated || response.data.success) {
            setTimeout(() => {
                setFaceEnrollActive(false);
                window.location.href = "/admin";
            }, 1500);
        }
        
      } catch (err) {
        // If it's a transient library error, retry detection
        if (err.message && err.message.includes("Box.constructor")) {
            requestAnimationFrame(runDetection);
        } else {
            setStatus(err.response?.data?.message || "Biometric Error");
            setIsScanning(false);
        }
      }
    };

    runDetection();
  };

  // Stop camera when modal closes
  const handleClose = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setFaceEnrollActive(false);
  };

  return (
    <>
      {faceEnrollActive && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-900/95 z-50 backdrop-blur-md p-8">

         <FaArrowLeft 
            className='absolute top-10 left-10 cursor-pointer h-7 w-7 text-zinc-700 dark:text-white hover:scale-110 transition-transform' 
            onClick={handleClose} 
         />

          <div className="relative mb-8">
            {/* Visual Scan Ring */}
            <div className={`absolute -inset-4 border-2 border-dashed rounded-full ${isScanning ? 'border-green-500 animate-spin-slow' : 'border-zinc-300 opacity-20'}`}></div>
            
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-[#0aaf0a] shadow-[0_0_40px_rgba(10,175,10,0.2)]">
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
              {isScanning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#0aaf0a] shadow-[0_0_15px_#0aaf0a] animate-scan"></div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-black uppercase text-zinc-800 dark:text-white mb-2">
            Admin {mode}
          </h2>
          
          <p className={`text-sm font-bold text-center mb-8 max-w-xs ${status.includes('Error') || status.includes('failed') ? 'text-red-500' : 'text-zinc-500'}`}>
            {status}
          </p>

          <button 
            onClick={handleEnroll}
            disabled={isScanning}
            className={`w-full max-w-xs py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl
                ${isScanning ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-[#0aaf0a] text-white hover:bg-zinc-900 active:scale-95'}
            `}
          >
            {isScanning ? "Processing..." : `Confirm ${mode}`}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { position: absolute; animation: scan 2s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </>
  );
};

export default FaceEnroll;
