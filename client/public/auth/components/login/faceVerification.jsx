import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import useLoginContext from './context'
import { FaArrowLeft } from 'react-icons/fa';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FaceVerification = () => {

  const matric = useLoginContext((state) => state.matric)
  const setLoginActiveSection = useLoginContext((state) => state.setLoginSection)

  const videoRef = useRef();
  const [status, setStatus] = useState("Loading AI Models...");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

        startVideo();

      } catch (err) {
        setStatus("Error loading models. Check folder location.");
      }
    };
    loadModels();
  }, []);

  const stopVideo = () => {
   
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => {
        track.stop(); // This physically turns off the camera hardware
      });

      videoRef.current.srcObject = null; // This clears the video element
      setStatus("Camera closed");
    
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => { videoRef.current.srcObject = stream; })
      .catch(() => setStatus("Camera access denied"));
    setStatus("Position your face and click Login");
  };

  


  const handleEnroll = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setStatus("Scanning... looking for stable frame");

    const runDetection = async () => {
      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.4 })
        ).withFaceLandmarks().withFaceDescriptor();

        if (!detection) {
          requestAnimationFrame(runDetection);
          return;
        }

        setStatus("Face found");
        const descriptorArray = Array.from(detection.descriptor);
        const response = await axios.post(`${BASE_URL}/api/login/face`, { descriptor: descriptorArray, matric }, { withCredentials: true });
        setStatus(response.data.message);
        stopVideo()

        if (response.data.success) {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
          setStatus(response.data.message);
          setIsScanning(false);
        } else {
          setIsScanning(false)
          setStatus('Face unrecognized')
        }

      } catch (err) {
        requestAnimationFrame(runDetection);
        stopVideo()
        setStatus('Detection error. please refresh page')
        setIsScanning(false)
      }
    };

    runDetection();
  };


  const handleBack = () => {
    stopVideo()
    setLoginActiveSection('matric')
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center
                     bg-white/95 ark:bg-[#030813]/95 backdrop-blur-md p-8 z-50">

      <button
        onClick={handleBack}
        className="absolute left-6 top-6 w-10 h-10 rounded-full flex items-center justify-center
                   bg-gray-100 ark:bg-white/5 text-gray-600 ark:text-gray-300
                   hover:bg-gray-200 ark:hover:bg-white/10 transition-colors"
      >
        <FaArrowLeft size={16} />
      </button>

      <div className="relative mb-6">
        <div className={`absolute -inset-3 rounded-full border-2 border-dashed transition-opacity
          ${isScanning ? 'border-green-900 ark:border-emerald-400 animate-[spin_8s_linear_infinite]' : 'border-gray-200 ark:border-white/10 opacity-40'}`} />
        <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-green-900 ark:border-emerald-400 shadow-2xl shadow-green-900/20">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
          {isScanning && (
            <div className="absolute left-0 w-full h-0.5 bg-green-900 ark:bg-emerald-400 shadow-[0_0_15px_rgba(6,78,59,0.6)] animate-[scanline_2s_linear_infinite]" />
          )}
        </div>
      </div>

      <p className="text-gray-500 ark:text-gray-400 mb-6 font-medium text-center max-w-xs">{status}</p>

      <button
        onClick={handleEnroll}
        disabled={isScanning}
        className={`px-10 py-3.5 rounded-full font-semibold text-white shadow-lg transition-all active:scale-95
          ${isScanning ? 'bg-gray-300 ark:bg-white/10 shadow-none' : 'bg-green-900 shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30'}`}
      >
        {isScanning ? "Processing..." : "Login with Face ID"}
      </button>

      <style>{`
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}

export default FaceVerification
