import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { FaArrowLeft } from 'react-icons/fa';
import { TbFaceId } from "react-icons/tb"; 


const FaceEnroll = ({ setFaceDescriptor }) => {
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading AI Models...");
  const [isScanning, setIsScanning] = useState(false);
  const [cam, setCam] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        if(cam) startVideo();
      } catch (err) {
        setStatus("Error loading models. Check /public/models.");
      }
    };
    loadModels();
  }, [cam]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => setStatus("Camera access denied"));
    setStatus("Position face and click Register");
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => {
        track.stop(); // This physically turns off the camera hardware
      });

      videoRef.current.srcObject = null; // This clears the video element
      setStatus("Camera closed");
    }
  };


  const handleEnroll = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setStatus("Scanning... extracting features");

    const runDetection = async () => {
      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.4 })
        ).withFaceLandmarks().withFaceDescriptor();

        // VALIDATION: Prevents the Box.constructor error
        if (!detection || !detection.detection || !detection.detection.box) {
          requestAnimationFrame(runDetection);
          return;
        }

        const descriptorArray = Array.from(detection.descriptor);
        setFaceDescriptor(descriptorArray);
        setStatus("Face captured successfully!");
        setIsScanning(false);
        stopVideo()
        setTimeout(() => setCam(false), 1000);
        
      } catch (err) {
        stopVideo()
        requestAnimationFrame(runDetection);
      }
    };
    runDetection();
  };

  const toggleFaceEnroll = () => {
    setFaceDescriptor('');
    stopVideo()
    setCam(!cam);
  };

  return (
    <>
      { cam ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-950/95 p-8 z-50 backdrop-blur-md">
          <FaArrowLeft className='absolute left-10 top-10 w-7 h-7 cursor-pointer text-zinc-800 dark:text-white' onClick={() => toggleFaceEnroll()} />
          
          <div className="relative mb-6">
            {/* Consistent Admin-style Ring */}
            <div className={`absolute -inset-4 border-2 border-dashed rounded-full ${isScanning ? 'border-green-500 animate-spin-slow' : 'border-zinc-300 opacity-20'}`}></div>
            
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-[#0aaf0a] shadow-2xl">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
                {isScanning && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#0aaf0a] shadow-[0_0_15px_#0aaf0a] animate-scanline"></div>
                )}
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-300 mb-6 font-bold text-center max-w-xs">{status}</p>
          <button 
            onClick={handleEnroll}
            disabled={isScanning}
            className={`px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl
                ${isScanning ? 'bg-zinc-200 text-zinc-400' : 'bg-[#0aaf0a] text-white active:scale-95'}
            `}
          >
            {isScanning ? "Processing..." : "Register My Face"}
          </button>
        </div>
      ) : (
        <button className='flex items-center justify-center border-2 border-green-400 text-white w-16 h-11 rounded-full bg-green-900 mx-auto' onClick={() => toggleFaceEnroll()}> 
            <TbFaceId size={24}/> 
        </button>
      )}

      <style jsx>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scanline { position: absolute; animation: scan 2s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </>
  );
};

export default FaceEnroll;
