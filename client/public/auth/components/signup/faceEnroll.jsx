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
        if (cam) startVideo();
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
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => {
      track.stop();
    });

    videoRef.current.srcObject = null;
    setStatus("Camera closed");
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
      {cam ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center
                         bg-white/95 ark:bg-[#030813]/95 backdrop-blur-md p-8 z-50">
          <button
            onClick={toggleFaceEnroll}
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
            {isScanning ? "Processing..." : "Register My Face"}
          </button>
        </div>
      ) : (
        <button
          className="flex items-center justify-center gap-2 border border-green-900/20 ark:border-emerald-400/20
                     text-green-900 ark:text-emerald-400 bg-green-900/5 ark:bg-emerald-400/10
                     px-6 h-11 rounded-full mx-auto font-semibold text-sm
                     hover:bg-green-900/10 ark:hover:bg-emerald-400/20 transition-colors"
          onClick={toggleFaceEnroll}
        >
          <TbFaceId size={20} /> Enroll Face ID
        </button>
      )}

      <style>{`
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>
    </>
  );
};

export default FaceEnroll;
